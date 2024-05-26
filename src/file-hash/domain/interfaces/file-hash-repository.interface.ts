export interface IFileHashRepository {
  getFileHash(value: string): Promise<string | null>;
  saveFileHash(value: string): Promise<void>;
}
