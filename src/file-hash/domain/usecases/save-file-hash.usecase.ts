import { IFileHashRepository } from '../interfaces/file-hash-repository.interface';

export class SaveFileHashUsacase {
  constructor(private repository: IFileHashRepository) {}
  async execute(value: string): Promise<void> {
    return this.repository.saveFileHash(value);
  }
}
