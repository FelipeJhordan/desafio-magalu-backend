import { UseCaseProxy } from '../usecase-proxy';

describe('UseCaseProxy', () => {
  describe('getInstance', () => {
    it('should return an instance of the use case', () => {
      const useCase = jest.fn();
      const useCaseProxy = new UseCaseProxy(useCase);

      const instance = useCaseProxy.getInstance();

      expect(instance).toBe(useCase);
    });
  });
});
