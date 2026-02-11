import { DeleteAboutSectionUseCase } from '../../Application/Use-cases/deleteAboutSection.use-case';
import { DeleteResult } from 'typeorm';
import {
  DomainError,
  EntityNotFoundError,
  InfrastructureError,
  InvalidEntityError,
} from 'src/Modules/Shared/custom-errors.exception';

// Unit tests for the DeleteAboutSectionUseCase
describe('DeleteAboutSectionUseCase', () => {

    // Variables to hold the use-case instance and mocks. Use mocks for unit testing because we want to isolate the use-case logic from external dependencies
    let usecase: DeleteAboutSectionUseCase;
    let mockRepo: any;
    let mockCache: any;
    let mockLogger: any;

    const listKey = 'about-sections:list';
    const sectionKey = 'about-section';

    // Runs before each test to reset mocks and create fresh instances
    beforeEach(() => {

        // Mock implementation of each dependency using Jest
        mockRepo = {
            remove: jest.fn(),
        };

        mockCache = {
            del: jest.fn(),
            lrem: jest.fn(),
        };

        mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
        };

        // Create a new instance of the use-case with mocked dependencies
        usecase = new DeleteAboutSectionUseCase(
            mockRepo,
            mockCache,
            mockLogger,
        );
    });

    // Test case: successful deletion of an about section
    it('deletes an about section successfully and updates cache', async () => {

        // Mock deleteResult and repository response to simulate successful deletion
        const deleteResult = ({ affected: 1 }) as DeleteResult;
        mockRepo.remove.mockResolvedValue(deleteResult);

        // Execute the use-case
        const result = await usecase.execute(1);

        // 
        expect(result).toBe(deleteResult);

        // Asserts that the logger logged the deletion message. toHaveBeenCalledWith checks if the mock function was called with specific arguments
        expect(mockLogger.log).toHaveBeenCalledWith('Deleting about section from the database...');

        // Checks if the repository's remove method was called with the correct aboutId
        expect(mockRepo.remove).toHaveBeenCalledWith(1);

        // Checks if cache deletion and list update methods were called with correct keys and values
        expect(mockCache.del).toHaveBeenCalledWith(`${sectionKey}:1`);
        expect(mockCache.lrem).toHaveBeenCalledWith(listKey, 0, 1)
    });

    // Test case: repository throws a DomainError
    it('rethrows domain error message (string) when repository throws a DomainError', async () => {

        // Makes repository.create throw a DomainError when called
        mockRepo.remove.mockRejectedValue(new DomainError('Invalid'));

        // Expects the use-case execution to rethrow the DomainError
        await expect(usecase.execute(3)).rejects.toBeInstanceOf(DomainError);
        
        // Asserts that the logger logged the error
        expect(mockLogger.error).toHaveBeenCalled();
    });

    // Test case: repository throws a EntityNotFoundError
    it('rethrows entity error message (string) when repository throws a EntityNotFoundError', async () => {

        // Makes repository.create throw a EntityNotFoundError when called
        mockRepo.remove.mockRejectedValue(new EntityNotFoundError('Nenhuma seção foi removida.'));

        // Expects the use-case execution to rethrow the EntityNotFoundError
        await expect(usecase.execute(3)).rejects.toBeInstanceOf(EntityNotFoundError);

        // Asserts that the logger logged the error
        expect(mockLogger.error).toHaveBeenCalled();
    });

    // Test case: repository throws a InvalidEntityError, which occurs when the input entity is invalid
    it('rethrows invalid entity error message (string) when repository throws a InvalidEntityError', async () => {

        // Expects the use-case execution to rethrow the InvalidEntityError
        await expect(usecase.execute(0)).rejects.toBeInstanceOf(InvalidEntityError);

        // Asserts that the logger logged the error
        expect(mockLogger.error).toHaveBeenCalled();

        // Asserts that the repository's remove method was not called
        expect(mockRepo.remove).not.toHaveBeenCalled();
        expect(mockCache.del).not.toHaveBeenCalled();
        expect(mockCache.lrem).not.toHaveBeenCalled();
    });

    // Test case: repository throws an unexpected error
    it('wraps unexpected errors as InfrastructureError', async () => {

        // Makes repository.remove throw a generic error when called
        mockRepo.remove.mockRejectedValue(new Error('database down'));

        try {

            // Executes the use-case which is expected to throw
            await usecase.execute(4);
            throw new Error('Expected useCase.execute to throw');
        } catch (err) {

            // Expects the caught error to be an InfrastructureError with the expected message
            expect(err).toBeInstanceOf(InfrastructureError);
            expect((err as Error).message).toBe('Erro ao remover a seção.');

            // Asserts that the logger logged the error
            expect(mockLogger.error).toHaveBeenCalled();
        }
    });
});
