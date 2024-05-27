import { HasFileHashUsecase } from '../has-file-hash.usecase';
import { IFileHashRepository } from '../../interfaces/file-hash-repository.interface';

describe('HasFileHashUsecase', () => {
  let usecase: HasFileHashUsecase;
  let repository: IFileHashRepository;

  beforeEach(() => {
    repository = {
      saveFileHash: jest.fn(),
      getFileHash: jest.fn(),
    };

    usecase = new HasFileHashUsecase(repository);
  });
  it('should return true if the file hash exists in the repository', async () => {
    const fileHash = 'abc123';
    repository.getFileHash = jest.fn().mockResolvedValue(true);

    const result = await usecase.execute(fileHash);

    expect(result).toBe(true);
    expect(repository.getFileHash).toHaveBeenCalledWith(fileHash);
  });
  it('should return false if the file hash does not exist in the repository', async () => {
    const fileHash = 'def456';
    (repository.getFileHash as jest.Mock).mockResolvedValue(false);

    const result = await usecase.execute(fileHash);

    expect(result).toBe(false);
    expect(repository.getFileHash).toHaveBeenCalledWith(fileHash);
  });
});
