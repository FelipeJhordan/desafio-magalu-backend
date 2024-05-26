import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IFileHashRepository } from '../../../../file-hash/domain/interfaces/file-hash-repository.interface';
import { FileHashEntity } from '../entities/file-hash.entity';
import { FileHash } from '../../../../file-hash/domain/entities/file-hash';

export class FileHashRepository implements IFileHashRepository {
  constructor(
    @InjectModel(FileHashEntity.name) private fileHashModel: Model<FileHash>,
  ) {}
  async getFileHash(hash: string): Promise<string | null> {
    const fileHashByDb = await this.fileHashModel
      .findOne({
        hash,
      })
      .lean();

    return fileHashByDb ? fileHashByDb?.hash : null;
  }

  async saveFileHash(value: string): Promise<void> {
    await this.fileHashModel.create({
      hash: value,
    });
  }
}
