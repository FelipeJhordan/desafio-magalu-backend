import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  I_FILE_HASH_REPOSITORY_TOKEN,
  I_HASH_ADAPTER_TOKEN,
} from './constants/ioc/ioc.constants';
import {
  FileHashEntity,
  FileHashSchema,
} from './infra/database/entities/file-hash.entity';
import { FileHashRepository } from './infra/database/repositories/file-hash.repository';
import { HashAdapter } from './infra/hash/hash.adapter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FileHashEntity.name,
        schema: FileHashSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: I_FILE_HASH_REPOSITORY_TOKEN,
      useClass: FileHashRepository,
    },
    {
      provide: I_HASH_ADAPTER_TOKEN,
      useClass: HashAdapter,
    },
  ],
  exports: [I_FILE_HASH_REPOSITORY_TOKEN, I_HASH_ADAPTER_TOKEN],
})
export class FileHashModule {}
