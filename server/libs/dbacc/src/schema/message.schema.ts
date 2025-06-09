import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as _ from "lodash";
import { BaseSchema } from "./base.schema";
import mongoose from "mongoose";
import { ModelNameEnum } from "@app/types";

@Schema({
  timestamps: true,
  collection: 'messages',
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
export class MessageType extends BaseSchema {
  @Prop({ type: mongoose.Types.ObjectId, ref: ModelNameEnum.USER, required: true })
  createdBy!: string;

  @Prop({ type: [mongoose.Types.ObjectId], ref: ModelNameEnum.USER, default: [] })
  seenBy!: string[];

  @Prop({ type: [String], default: [] }) 
  reactions!: string[];

  @Prop({ type: String, required: true })
  text!: string;

  @Prop({ type: Boolean, default: false })
  isDeleted!: boolean;

  @Prop({ type: Boolean, default: false })
  isEdited!: boolean;

  @Prop({ type: Date, default: Date.now })
  editedAt!: Date;

  @Prop({ type: mongoose.Types.ObjectId, ref: ModelNameEnum.CONVERSATION, required: true })
  conversationId!: string;
}

export const MessageSchema = SchemaFactory.createForClass(MessageType);