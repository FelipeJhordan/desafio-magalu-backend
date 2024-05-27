import { HashAdapter } from './hash.adapter';

describe('HashAdapter', () => {
  const bufferDummy = Buffer.from('Hash-test');
  let hashAdapter: HashAdapter;

  beforeEach(() => {
    hashAdapter = new HashAdapter();
  });

  it('should hash a buffer and return a string', () => {
    const fileBuffer = bufferDummy;
    const hash = hashAdapter.hash(fileBuffer);
    expect(typeof hash).toBe('string');
  });

  it('should hash the same buffer consistently', () => {
    const fileBuffer = bufferDummy;
    const hash1 = hashAdapter.hash(fileBuffer);
    const hash2 = hashAdapter.hash(fileBuffer);
    expect(hash1).toBe(hash2);
  });

  it('should hash different buffers differently', () => {
    const fileBuffer1 = bufferDummy;
    const fileBuffer2 = Buffer.from('Hash-test-2');
    const hash1 = hashAdapter.hash(fileBuffer1);
    const hash2 = hashAdapter.hash(fileBuffer2);
    expect(hash1).not.toBe(hash2);
  });
});
