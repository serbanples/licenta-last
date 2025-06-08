import { Injectable } from "@nestjs/common";
import { AbstractModel } from "./abstract.model";
import { LoggerService } from "@app/logger";
import { ModelNameEnum, PopulateOpts } from "@app/types";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { NotificationType } from "../schema";

/**
 * Class used to access mongo db logic for users.
 */
@Injectable()
export class NotificationModel extends AbstractModel<NotificationType> {
  protected override textSearchFields: string[] = [];
  protected override populateOptions: PopulateOpts = [{ path: 'receiverId', model: ModelNameEnum.USER, select: 'email fullName' }];

  /**
   * Constructor method.
   * 
   * @param {mongoose.Model<UserType>} model user model type to use.
   * @param {LoggerService} logger logger used to log errors.
   */
  constructor(@InjectModel(NotificationType.name) model: mongoose.Model<NotificationType>, logger: LoggerService) {
    super(model, logger);
  }
}