import { Injectable } from "@nestjs/common";
import { AbstractModel } from "./abstract.model";
import { LoggerService } from "@app/logger";
import { ModelNameEnum, PopulateOpts } from "@app/types";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { FriendRequestType, } from "../schema";

/**
 * Class used to access mongo db logic for users.
 */
@Injectable()
export class FriendRequestModel extends AbstractModel<FriendRequestType> {
  protected override textSearchFields: string[] = [];
  protected override populateOptions: PopulateOpts = [{
    path: 'senderId', model: ModelNameEnum.USER, select: 'email fullName'
  }, { path: 'receiverId', model: ModelNameEnum.USER, select: 'email fullName' }];

  /**
   * Constructor method.
   * 
   * @param {mongoose.Model<UserType>} model user model type to use.
   * @param {LoggerService} logger logger used to log errors.
   */
  constructor(@InjectModel(FriendRequestType.name) model: mongoose.Model<FriendRequestType>, logger: LoggerService) {
    super(model, logger);
  }
}