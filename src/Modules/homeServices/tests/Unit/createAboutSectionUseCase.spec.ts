import { validate as classValidate } from "class-validator";
import { CreateAboutSectionUseCase } from "../../Application/Use-cases/createHomeServices.use-case";
import { CreateAboutSectionDto } from "../../Interfaces/DTOs/create-homeServices.dto";
import { DomainError } from "src/Modules/Shared/custom-errors.exception";

// Mock the class-validator validate function
jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'), // require the actual module to not mock other functions
  validate: jest.fn(),                      // mock only the validate function
}));

// Unit tests for the CreateAboutSectionUseCase
describe('CreateAboutSectionUseCase (unit)', () => {

  // Variables to hold the use-case instance and mocks. Use mocks for unit testing because we want to isolate the use-case logic from external dependencies
  let usecase: CreateAboutSectionUseCase;
  let mockRepo: any;
  let mockCache: any;
  let mockLogger: any;

  const listKey = 'about-sections:list';
  const sectionTtl = (60000 * 60) * 24;

  // Runs before each test to reset mocks and create fresh instances
  beforeEach(() => {

    // Mock implementation of each dependency using Jest
    mockRepo = {
      create: jest.fn(),
    };

    mockCache = {
      rpush: jest.fn(),
      lrange: jest.fn(),
      mdel: jest.fn(),
    };

    mockLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    // Create a new instance of the use-case with mocked dependencies
    usecase = new CreateAboutSectionUseCase(
      mockRepo,
      mockCache,
      mockLogger,
    );

    // Clear the mock for validate function. Useful if validate is mocked in individual tests
    (classValidate as jest.Mock).mockClear();
  });

  // Test case: successful creation of an about section
  it('creates a section, pushes ID to the cache list, and caches the section', async () => {

    // Mock the validate function to return no errors
    (classValidate as jest.Mock).mockResolvedValue([]);

    // Input DTO for creating an about section
    const dto = new CreateAboutSectionDto();
    dto.section = 'X';
    dto.contentText = 'Content';

    // Mocked created object returned by the repository
    const created = {
      aboutId: 1,
      section: 'X',
      contentText: 'Content',
    };

    // Makes repository return the created object when called. mockResolvedValue simulates an async function returning a resolved promise
    mockRepo.create.mockResolvedValue(created);

    // Mocks cache methods to return expected values
    mockCache.lrange.mockResolvedValue([]);
    mockCache.mdel.mockResolvedValue(null);
    mockCache.rpush.mockResolvedValue(null);

    // Executes the use-case with the DTO
    const result = await usecase.execute(dto);

    // Asserts that the logger logged the creation message. toHaveBeenCalledWith checks if the mock function was called with specific arguments
    expect(mockLogger.log).toHaveBeenCalledWith('Creating about section...');

    // Checks if repository.create was called with the same input DTO
    expect(mockRepo.create).toHaveBeenCalledWith(dto);

    // Checks if cache methods were called with correct parameters
    expect(mockCache.rpush).toHaveBeenCalledWith(
      listKey,
      created.aboutId,
      sectionTtl,
    );

    // Asserts that the result from the use-case matches the created object
    expect(result).toEqual(created);
  });

  // Test case: repository returns null (no section created)
  it('returns error if repository returns null', async () => {

    // Input DTO for creating an about section
    const dto = new CreateAboutSectionDto();
    dto.section = 'X';
    dto.contentText = 'Content';
    
    // Makes repository return null to simulate no section being created
    mockRepo.create.mockResolvedValue(null);

    // Expects the use-case execution to throw a specific error message
    await expect(usecase.execute(dto)).rejects.toThrow('Nenhuma seção foi criada.');

    // Asserts that the logger logged the error
    expect(mockLogger.error).toHaveBeenCalled();
  });

  // Test case: validation error before executing the use-case (DTO fails validation)
  it('throws validation error before finishing to create', async () => {

    // Fake validation errors to be returned by the validate function
    const fakeErrors = [
      { constraints: { isNotEmpty: 'Seção não pode estar vazia.' } },
    ];

    // Mock the validate function to return fake validation errors
    (classValidate as jest.Mock).mockResolvedValue(fakeErrors);

    // DTO with invalid data to trigger validation errors
    const dto = new CreateAboutSectionDto();
    dto.section = '';
    dto.contentText = '';

    // Expects the use-case execution to throw a DomainError due to validation failure
    await expect(usecase.execute(dto)).rejects.toThrow(DomainError);

    // Checks that validate was called with the correct DTO and options
    expect(classValidate).toHaveBeenCalledWith(dto, { stopAtFirstError: true });

    expect(mockRepo.create).not.toHaveBeenCalled(); // Ensures repository.create was not called due to validation failure
    expect(mockLogger.error).toHaveBeenCalled();    // Asserts that the logger logged the error
  });

  // Test case: no DTO provided
  it('throws error when no DTO is provided', async () => {
    
    // Expects the use-case execution to throw an error when no DTO is provided
    await expect(usecase.execute(null)).rejects.toThrow('Dados da seção são obrigatórios para criação.');

    // Asserts that the logger logged the error
    expect(mockLogger.error).toHaveBeenCalled();
  });

  // Test case: rethrows DomainError from repository
  it('rethrows DomainError from repository', async () => {

    // Mock the validate function to return no errors
    (classValidate as jest.Mock).mockResolvedValue([]);
  
    // Input DTO for creating an about section
    const dto = new CreateAboutSectionDto();
    dto.section = 'X';
    dto.contentText = 'Content';

    // Makes repository.create throw a DomainError when called
    mockRepo.create.mockRejectedValue(new DomainError('Invalid'));

    // Expects the use-case execution to rethrow the DomainError
    await expect(usecase.execute(dto)).rejects.toBeInstanceOf(DomainError);

    // Asserts that the logger logged the error
    expect(mockLogger.error).toHaveBeenCalled();
  });

  // Test case: repository throws an exception
  it('wraps unknown errors in general create error', async () => {

    // Mock the validate function to return no errors
    (classValidate as jest.Mock).mockResolvedValue([]);

    // Input DTO for creating an about section
    const dto = new CreateAboutSectionDto();
    dto.section = 'X';
    dto.contentText = 'Content';

    // Makes repository.create throw an error when called
    mockRepo.create.mockRejectedValue(new Error('DB error'));

    // Expects the use-case execution to throw a generic error message
    await expect(usecase.execute(dto)).rejects.toThrow(
      'Erro ao criar a seção.'
    );

    // Asserts that the logger logged the error
    expect(mockLogger.error).toHaveBeenCalled();
  });
});
