import { SaveFileHashUsacase } from '../save-file-hash.usecase';
import { IFileHashRepository } from '../../interfaces/file-hash-repository.interface';

describe('SaveFileHashUsacase', () => {
  let saveFileHashUsacase: SaveFileHashUsacase;
  let fileHashRepository: IFileHashRepository;

  beforeEach(() => {
    fileHashRepository = {
      saveFileHash: jest.fn(),
      getFileHash: jest.fn(),
    };
    saveFileHashUsacase = new SaveFileHashUsacase(fileHashRepository);
  });

  it('should save the file hash', async () => {
    const fileHash = 'abcdef123456';
    await saveFileHashUsacase.execute(fileHash);
    expect(fileHashRepository.saveFileHash).toHaveBeenCalledWith(fileHash);
  });
});
