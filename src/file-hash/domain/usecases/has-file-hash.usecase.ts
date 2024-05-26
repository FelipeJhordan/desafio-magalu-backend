import { IFileHashRepository } from '../interfaces/file-hash-repository.interface';

export class HasFileHashUsecase {
  constructor(private repository: IFileHashRepository) {}

  async execute(fileHash: string): Promise<boolean> {
    const fileHashByDatabase = await this.repository.getFileHash(fileHash);
    return !!fileHashByDatabase;
  }
}
