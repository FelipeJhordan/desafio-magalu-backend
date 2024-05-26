export interface IHashAdapter {
  hash(file: Buffer): string;
}
