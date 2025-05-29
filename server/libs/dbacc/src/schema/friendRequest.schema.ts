import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import _ from "lodash";
import { FriendRequestStatusEnum, ModelNameEnum } from "@app/types";
import mongoose from "mongoose";

@Schema({
  timestamps: true,
  collection: 'friendRequests',
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
export class FriendRequestType extends BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ModelNameEnum.USER, required: true })
  senderId!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ModelNameEnum.USER, required: true })
  receiverId!: string;

  @Prop({ type: String, enum: FriendRequestStatusEnum, default: FriendRequestStatusEnum.PENDING })
  status!: FriendRequestStatusEnum;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequestType);