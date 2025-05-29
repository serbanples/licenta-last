import { Injectable } from "@nestjs/common";
import { AbstractModel } from "./abstract.model";
import { LoggerService } from "@app/logger";
import { ModelNameEnum, PopulateOpts } from "@app/types";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { UserType } from "../schema";

/**
 * Class used to access mongo db logic for users.
 */
@Injectable()
export class UserModel extends AbstractModel<UserType> {
  protected override textSearchFields: string[] = ['email', 'fullName'];
  protected override populateOptions: PopulateOpts = [{
    path: 'friends', model: ModelNameEnum.USER, select: 'email fullName'
  }, {
    path: 'friendRequests', model: ModelNameEnum.FRIEND_REQUEST, select: 'senderId receiverId status',
  }];

  /**
   * Constructor method.
   * 
   * @param {mongoose.Model<UserType>} model user model type to use.
   * @param {LoggerService} logger logger used to log errors.
   */
  constructor(@InjectModel(UserType.name) model: mongoose.Model<UserType>, logger: LoggerService) {
    super(model, logger);
  }
}