import { Injectable } from "@nestjs/common";
import { AbstractModel } from "./abstract.model";
import { ConversationType } from "../schema";
import { ModelNameEnum, PopulateOpts } from "@app/types";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { LoggerService } from "@app/logger";

/**
 * Class used to access mongo db logic for conversations.
 */
@Injectable()
export class ConversationModel extends AbstractModel<ConversationType> {
  protected override textSearchFields: string[] = ['title', 'description'];
  protected override populateOptions: PopulateOpts = [{
    path: 'participants', model: ModelNameEnum.USER, select: 'email fullName'
  }];

  /**
   * Constructor method.
   * 
   * @param {mongoose.Model<ConversationType>} model conversation model type to use.
   * @param {LoggerService} logger logger used to log errors.
   */
  constructor(@InjectModel(ConversationType.name) model: mongoose.Model<ConversationType>, logger: LoggerService) {
    super(model, logger);
  }
}