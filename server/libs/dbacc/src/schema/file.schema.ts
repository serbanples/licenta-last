import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { FileTypeEnum, ModelNameEnum } from "@app/types";
import { BaseSchema } from "./base.schema";

export type FileDocument = FileType & Document;

@Schema({
    timestamps: true,
    collection: 'files',
    toJSON: {
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret.id;
            delete ret.__v;
        },
    },
    toObject: {
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        },
    },
})
export class FileType extends BaseSchema {
    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: false, type: String, default: '' })
    description: string;

    @Prop({ required: true, type: String })
    fileURL: string;

    @Prop({ required: true, type: String })
    mimeType: string;

    @Prop({ required: true, type: Number })
    size: number;

    @Prop({ type: Types.ObjectId, ref: ModelNameEnum.USER, required: true })
    uploadedBy: string;

    @Prop({ required: true, enum: FileTypeEnum})
    fileType: FileTypeEnum;

}

export const FileSchema = SchemaFactory.createForClass(FileType);