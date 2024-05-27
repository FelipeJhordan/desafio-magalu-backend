import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileHashRepository } from './file-hash.repository';
import { FileHashEntity } from '../entities/file-hash.entity';
import { FileHash } from '../../../../file-hash/domain/entities/file-hash';
import { queryResponseFixture } from '../../../../tests/fixtures/query.fixture';

describe('FileHashRepository', () => {
  let repository: FileHashRepository;
  let fileHashModel: Model<FileHash>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileHashRepository,
        {
          provide: getModelToken(FileHashEntity.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn().mockReturnValueOnce(queryResponseFixture),
            create: jest.fn(),
            save: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<FileHashRepository>(FileHashRepository);
    fileHashModel = module.get<Model<FileHash>>(
      getModelToken(FileHashEntity.name),
    );
  });

  describe('getFileHash', () => {
    it('should return the file hash if it exists', async () => {
      const hash = 'abc123';
      const fileHash = { _id: '1', hash: 'abc123', value: 'file-value' };

      jest.spyOn(queryResponseFixture, 'lean').mockResolvedValueOnce(fileHash);

      const result = await repository.getFileHash(hash);

      expect(result).toEqual(hash);
      expect(fileHashModel.findOne).toHaveBeenCalledWith({ hash });
    });

    it('should return null if the file hash does not exist', async () => {
      const hash = 'abc123';

      jest.spyOn(queryResponseFixture, 'lean').mockResolvedValueOnce(null);

      const result = await repository.getFileHash(hash);

      expect(result).toBeNull();
      expect(fileHashModel.findOne).toHaveBeenCalledWith({ hash });
    });
  });

  describe('saveFileHash', () => {
    it('should save the file hash', async () => {
      const value = 'file-value';

      const mockFileHash = {
        save: jest.fn(),
      };

      jest
        .spyOn(fileHashModel, 'create')
        .mockReturnValueOnce(mockFileHash as any);

      await repository.saveFileHash(value);

      expect(fileHashModel.create).toHaveBeenCalledWith({ hash: value });
    });
  });
});
