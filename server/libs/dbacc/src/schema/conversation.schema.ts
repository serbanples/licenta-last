import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import _ from "lodash";
import mongoose from "mongoose";
import { ModelNameEnum } from "@app/types";

/* eslint-disable @typescript-eslint/no-dynamic-delete */

/**
 * Class used to define the user schema.
 */
@Schema({
  timestamps: true,
  collection: 'conversations',
  toJSON: {
    virtuals: true,
    transform: (__, ret) => {
      if (!_.isNil(ret['_id'])) {
        ret['_id'] = ret['_id'].toString();
      }
      delete ret['_id'];
      delete ret['__v'];
    }
  },
  toObject: {
    virtuals: true,
    transform: (__, ret) => {
      if (!_.isNil(ret['_id'])) {
        ret['_id'] = ret['_id'].toString();
      }
      delete ret['_id'];
      delete ret['__v'];
    }
  }
})
export class ConversationType extends BaseSchema {
  @Prop({ type: mongoose.Types.ObjectId, ref: ModelNameEnum.USER, required: true })
  participants!: mongoose.Types.ObjectId[];

  @Prop({ type: mongoose.Types.ObjectId, ref: ModelNameEnum.MESSAGE, required: true })
  messages!: mongoose.Types.ObjectId[];

  @Prop({ type: String })
  title!: string;
  
  @Prop({ type: String })
  description!: string;
}

export const ConversationSchema = SchemaFactory.createForClass(ConversationType);