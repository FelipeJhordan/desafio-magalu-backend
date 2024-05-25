import { Prop, Schema } from '@nestjs/mongoose';

@Schema({
  collection: 'file-hash',
})
export class FileHashEntity {
  @Prop()
  hash: string;
}
