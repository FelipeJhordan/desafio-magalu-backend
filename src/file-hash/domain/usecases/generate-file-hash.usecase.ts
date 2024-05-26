import { IHashAdapter } from '../interfaces/hash-adapter.interface';

export class GenerateFileHashUseCase {
  constructor(private hashAdapter: IHashAdapter) {}
  public execute(file: Buffer): string {
    return this.hashAdapter.hash(file);
  }
}
