export interface FileHashRepositoryInterface {
  hasFileHash(value: string): Promise<boolean>;
  saveFileHash(value: string): Promise<void>;
}
