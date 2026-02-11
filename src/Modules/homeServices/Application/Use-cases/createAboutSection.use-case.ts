import { Inject, Injectable, Logger } from "@nestjs/common";
import { validate } from "class-validator";
import { CacheService } from "src/Modules/Shared/cache.service";
import { AboutRepositoryInterface } from "../../Domain/Repositories/about.repository.interface";
import { CreateAboutSectionDto } from "../../Interfaces/DTOs/create-about-section.dto";
import { AboutDto } from "../DTO/about.dto";
import { EntityNotFoundError, DomainError, InvalidEntityError, InfrastructureError, ForbiddenError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

// Use case for creating an about section
@Injectable()
export class CreateAboutSectionUseCase {

    // Injecting the About repository, Cache service and Logger using dependency injection for the use case to interact with the data layer, caching layer and log important information or errors
    constructor(
        @Inject('AboutRepositoryInterface')
        private readonly aboutRepository: AboutRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to execute the use case, taking a CreateAboutSectionDto as input, caching the created about section, and returning a Promise that resolves to the created AboutEntity
    async execute(createAboutSectionDto: CreateAboutSectionDto, actor: ActorType): Promise<AboutDto> {

        const listKey = 'about-sections:list';
        const sectionKey = 'about-section';
        const sectionTtl = (60000 * 60) * 24; // 24 hours in milliseconds

        try {

            this.logger.log('Veryfing user...');

            if (!actor || !actor.roles?.includes('admin')) {
                            
                throw new ForbiddenError('Você não tem permissão para executar esta ação.');
            }

            if (!createAboutSectionDto || Object.keys(createAboutSectionDto).length === 0) {
             
                throw new InvalidEntityError('Dados da seção são obrigatórios para criação.');
            }

            this.logger.log('User verified. Validating about section...');

            // Validate the created about section DTO
            const errors = await validate(createAboutSectionDto, { stopAtFirstError: true });

            // If there are validation errors, throw an error
            if (errors.length > 0) {

                // Extract all constraint messages from validation errors
                // flatMap is used to flatten the array of arrays into a single array
                const messages = errors.flatMap(
                    err => Object.values(err.constraints || {}) // Get constraint messages or empty array
                );

                throw new InvalidEntityError(messages.join('; ')); // Join messages into a single string. Remember to properly format on frontend
            }            
            
            this.logger.log('Creating about section...');
    
            // Create the about section in the repository
            const newAboutSection = await this.aboutRepository.create(createAboutSectionDto);

            if (!newAboutSection) {

                this.logger.log('No section was created.');
                throw new EntityNotFoundError('Nenhuma seção foi criada.');
            }

            this.logger.log('Section successfully created on database. Removing previously created sections from the cache...');

            // Gets previously cached sections and remove them to maintain cache consistency
            const rawAboutSectionsIds = await this.cacheService.lrange(listKey); // returns strings. so convert to numbers later
            
            if (rawAboutSectionsIds && rawAboutSectionsIds.length > 0) {

                const aboutSectionsIds = rawAboutSectionsIds.map(id => Number(id));
                const keysToDelete = aboutSectionsIds.map(id => `${sectionKey}:${id}`);

                await this.cacheService.mdel(keysToDelete);
            }

            this.logger.log('Stale cache deleted. Appending the new ID onto its appropriate cache list...');

            // Appending the result to cache list with rpush to avoid multiple inserts overwriting each other
            await this.cacheService.rpush<string>(listKey, newAboutSection.aboutId, sectionTtl)
    
            this.logger.log('About section list cached successfully.');

            return newAboutSection;
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error creating the about section:', err);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao criar a seção.');
        }
    }
}