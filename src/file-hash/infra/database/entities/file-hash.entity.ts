import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'file-hash',
})
export class FileHashEntity {
  @Prop()
  hash: string;
}

export const FileHashSchema = SchemaFactory.createForClass(FileHashEntity);
