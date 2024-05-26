import * as cryptoJs from 'crypto-js';

import { IHashAdapter } from '../../../file-hash/domain/interfaces/hash-adapter.interface';
export class HashAdapter implements IHashAdapter {
  hash(file: Buffer): string {
    return cryptoJs.SHA256(file.toString()).toString(cryptoJs.enc.Hex);
  }
}
