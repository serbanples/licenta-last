import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "./base.schema";
import * as _ from "lodash";
import { ModelNameEnum } from "@app/types";
import mongoose from "mongoose";

@Schema({
  timestamps: true,
  collection: 'users',
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
export class UserType extends BaseSchema {
  @Prop({ required: true, unique: true, type: String, })
  email!: string;

  @Prop({ required: true, type: String, })
  fullName!: string;

  @Prop({ required: true, type: String })
  accountId!: string;

  @Prop({ type: String, default: '' })
  description!: string;

  @Prop({ type: [mongoose.Types.ObjectId], default: [], ref: ModelNameEnum.USER })
  friends!: string[];

  @Prop({ type: [mongoose.Types.ObjectId], default: [], ref: ModelNameEnum.USER })
  friendRequests!: string[];

  @Prop({ type: String, default: '' })
  profilePictureUrl!: string;

  @Prop({ type: [mongoose.Types.ObjectId], default: [], ref: ModelNameEnum.FILE })
  files!: string[];
}

export const UserSchema = SchemaFactory.createForClass(UserType);