import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import * as _ from "lodash";
import { FriendRequestStatusEnum, ModelNameEnum, NotificationTopicEnum } from "@app/types";
import mongoose from "mongoose";

@Schema({
  timestamps: true,
  collection: 'notifications',
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
export class NotificationType extends BaseSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: ModelNameEnum.USER, required: true })
  sendTo!: string[];

  @Prop({ type: String, enum: NotificationTopicEnum })
  topic!: FriendRequestStatusEnum;

  @Prop({ type: Object })
  data!: any;

  @Prop({ type: Boolean, default: false })
  isSeen!: boolean;
}

export const NotificationScheam = SchemaFactory.createForClass(NotificationType);