import { Inject, Injectable, Logger } from "@nestjs/common";
import { validate } from "class-validator";
import { CacheService } from "src/Modules/Shared/cache.service";
import { HomeServicesRepositoryInterface } from "../../Domain/Repositories/homeServices.repository.interface";
import { UpdateHomeServicesSectionDto } from "../../Interfaces/DTOs/update-homeServices.dto";
import { HomeServicesDto } from "../DTO/homeServices.dto";
import { DomainError, EntityNotFoundError, ForbiddenError, InfrastructureError, InvalidEntityError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

// Use case for updating the home Services section
@Injectable()
export class UpdateHomeServicesSectionUseCase {

    // Injecting the home Services repository, Cache service and Logger using dependency injection for the use case to interact with the data layer, caching layer and log important information or errors
    constructor(
        @Inject('HomeServicesRepositoryInterface')
        private readonly homeServicesRepository: HomeServicesRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to execute the use case, taking the section ID and a updateHomeServicesSectionDto as input, deleting the old section and caching the updated one, and returning a Promise that resolves to the an object containing a success message and the updated home Services section data
    async execute(homeServicesId: number, updateHomeServicesSectionDto: UpdateHomeServicesSectionDto, actor: ActorType): Promise<Object> {

        const sectionKey = 'home-services-section';
        const sectionTtl = (60000 * 60) * 24; // 24 hours in milliseconds

        try {

            this.logger.log('Veryfing user...');

            if (!actor || !actor.roles?.includes('admin')) {
                            
                throw new ForbiddenError('Você não tem permissão para executar esta ação.');
            }

            if (!updateHomeServicesSectionDto || Object.keys(updateHomeServicesSectionDto).length === 0) {
             
                throw new InvalidEntityError('Para atualizar, pelo menos um campo da seção deve ser preenchido.');
            }

            this.logger.log('User verified. Validating home Services section...');

            // Validate the updated home Services section DTO
            const errors = await validate(updateHomeServicesSectionDto, { stopAtFirstError: true });

            // If there are validation errors, throw an error
            if (errors.length > 0) {

                // Extract all constraint messages from validation errors
                // flatMap is used to flatten the array of arrays into a single array
                const messages = errors.flatMap(
                    err => Object.values(err.constraints || {}) // Get constraint messages or empty array
                );

                throw new InvalidEntityError(messages.join('; ')); // Join messages into a single string. Remember to properly format on frontend
            }
            
            this.logger.log('Updating home Services section...');

            // Update the home Services section in the repository
            const updatedHomeServicesSection = await this.homeServicesRepository.update(homeServicesId, updateHomeServicesSectionDto);

            if (!updatedHomeServicesSection) {

                console.log(updatedHomeServicesSection);

                this.logger.log('No section was updated.');
                throw new EntityNotFoundError('Nenhuma seção foi atualizada.');
            }

            this.logger.log('Section successfully updated on database. Deleting the old section from cache...');

            // Deleting the old cached section
            await this.cacheService.del(`${sectionKey}:${homeServicesId}`);

            this.logger.log('Old section deleted from cache. Caching the updated section...');

            // Caching updated section
            await this.cacheService.set<HomeServicesDto>(`${sectionKey}:${homeServicesId}`, updatedHomeServicesSection, sectionTtl);
    
            this.logger.log('Home Services section cached successfully');
            
            return {
                message: 'Seção "Serviços" da Home atualizada com sucesso.',
                updatedHomeServicesSection,
            };
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error updating the home Services section:', err);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao atualizar a seção "Serviços" da Home.');
        }
    }
}