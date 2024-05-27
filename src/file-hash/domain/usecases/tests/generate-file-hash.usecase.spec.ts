import { GenerateFileHashUseCase } from '../generate-file-hash.usecase';
import { IHashAdapter } from '../../interfaces/hash-adapter.interface';

describe('GenerateFileHashUseCase', () => {
  let generateFileHashUseCase: GenerateFileHashUseCase;
  let hashAdapter: IHashAdapter;

  beforeEach(() => {
    hashAdapter = {
      hash: jest.fn().mockReturnValue('mocked-hash'),
    };
    generateFileHashUseCase = new GenerateFileHashUseCase(hashAdapter);
  });

  it('should generate file hash correctly', () => {
    const fileBuffer = Buffer.from('test-file-content');
    const expectedHash = 'mocked-hash';

    const result = generateFileHashUseCase.execute(fileBuffer);

    expect(hashAdapter.hash).toHaveBeenCalledWith(fileBuffer);
    expect(result).toBe(expectedHash);
  });
});
