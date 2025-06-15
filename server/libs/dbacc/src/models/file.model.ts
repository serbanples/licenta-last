import { Injectable } from "@nestjs/common";
import { AbstractModel } from "./abstract.model";
import { FileType } from "../schema";
import { ModelNameEnum, PopulateOpts } from "@app/types";
import { InjectModel } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { LoggerService } from "@app/logger";

/**
 * Class used to access mongo db logic for conversations.
 */
@Injectable()
export class FileModel extends AbstractModel<FileType> {
  protected override textSearchFields: string[] = ['title', 'description'];
  protected override populateOptions: PopulateOpts = [{
    path: 'uploadedBy', model: ModelNameEnum.USER, select: 'email fullName'
  }];

  /**
   * Constructor method.
   * 
   * @param {mongoose.Model<ConversationType>} model conversation model type to use.
   * @param {LoggerService} logger logger used to log errors.
   */
  constructor(@InjectModel(FileType.name) model: mongoose.Model<FileType>, logger: LoggerService) {
    super(model, logger);
  }
}