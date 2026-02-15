import { Inject, Injectable, Logger } from "@nestjs/common";
import { validate } from "class-validator";
import { CacheService } from "src/Modules/Shared/cache.service";
import { HomeServicesRepositoryInterface } from "../../Domain/Repositories/homeServices.repository.interface";
import { CreateHomeServicesSectionDto } from "../../Interfaces/DTOs/create-homeServices.dto";
import { EntityNotFoundError, DomainError, InvalidEntityError, InfrastructureError, ForbiddenError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

// Use case for creating the home Services section
@Injectable()
export class CreateHomeServicesSectionUseCase {

    // Injecting the home Services repository, Cache service and Logger using dependency injection for the use case to interact with the data layer, caching layer and log important information or errors
    constructor(
        @Inject('HomeServicesRepositoryInterface')
        private readonly homeServicesRepository: HomeServicesRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to execute the use case, taking a CreateHomeServicesSectionDto as input, caching the created Services section, and returning a Promise that resolves to a object containing a success message and the created Services section data
    async execute(createHomeServicesSectionDto: CreateHomeServicesSectionDto, actor: ActorType): Promise<Object> {

        const sectionKey = 'home-services-section';

        try {

            this.logger.log('Veryfing user...');

            if (!actor || !actor.roles?.includes('admin')) {
                            
                throw new ForbiddenError('Você não tem permissão para executar esta ação.');
            }

            if (!createHomeServicesSectionDto || Object.keys(createHomeServicesSectionDto).length === 0) {
             
                throw new InvalidEntityError('Dados da seção são obrigatórios para criação.');
            }

            this.logger.log('User verified. Validating home Services section...');

            // Validate the created home Services section DTO
            const errors = await validate(createHomeServicesSectionDto, { stopAtFirstError: true });

            // If there are validation errors, throw an error
            if (errors.length > 0) {

                // Extract all constraint messages from validation errors
                // flatMap is used to flatten the array of arrays into a single array
                const messages = errors.flatMap(
                    err => Object.values(err.constraints || {}) // Get constraint messages or empty array
                );

                throw new InvalidEntityError(messages.join('; ')); // Join messages into a single string. Remember to properly format on frontend
            }            
            
            this.logger.log('Creating Services section...');
    
            // Create the Services section in the repository
            const newHomeServicesSection = await this.homeServicesRepository.create(createHomeServicesSectionDto);

            if (!newHomeServicesSection) {

                this.logger.log('No section was created.');
                throw new EntityNotFoundError('Nenhuma seção foi criada.');
            }

            this.logger.log('Section successfully created on database. Removing previously created section from the cache...');

            // Gets previously cached section and remove it to maintain cache consistency
            await this.cacheService.del(`${sectionKey}:${newHomeServicesSection.homeServicesId}`);
    
            this.logger.log('Home Services section cached successfully.');

            return {
                success: true,
                message: 'Seção "Serviços" da Home criada com sucesso.',
                data: newHomeServicesSection,
            };
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error creating the home Services section:', err);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao criar a seção "Serviços" da Home.');
        }
    }
}