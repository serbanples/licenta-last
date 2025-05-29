import { ModelNameEnum, PopulateOpts } from "@app/types";
import { MessageType } from "../schema";
import { AbstractModel } from "./abstract.model";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { LoggerService } from "@app/logger";

export class MessageModel extends AbstractModel<MessageType> {
  protected override textSearchFields: string[] = ['content'];
  protected override populateOptions: PopulateOpts = [{
    path: 'createdBy', model: ModelNameEnum.USER, select: 'email fullName'
  }, {
    path: 'seenBy', model: ModelNameEnum.USER, select: 'email fullName'
  }];

  /**
   * Constructor method.
   * 
   * @param {mongoose.Model<MessageType>} model message model type to use.
   * @param {LoggerService} logger logger used to log errors.
   */
  constructor(@InjectModel(MessageType.name) model: mongoose.Model<MessageType>, logger: LoggerService) {
    super(model, logger);
  }
}