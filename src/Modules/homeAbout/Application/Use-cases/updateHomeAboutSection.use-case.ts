import { Inject, Injectable, Logger } from "@nestjs/common";
import { validate } from "class-validator";
import { CacheService } from "src/Modules/Shared/cache.service";
import { HomeAboutRepositoryInterface } from "../../Domain/Repositories/homeAbout.repository.interface";
import { UpdateHomeAboutSectionDto } from "../../Interfaces/DTOs/update-homeAbout-section.dto";
import { HomeAboutDto } from "../DTO/homeAbout.dto";
import { DomainError, EntityNotFoundError, ForbiddenError, InfrastructureError, InvalidEntityError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

// Use case for updating the home about section
@Injectable()
export class UpdateHomeAboutSectionUseCase {

    // Injecting the home About repository, Cache service and Logger using dependency injection for the use case to interact with the data layer, caching layer and log important information or errors
    constructor(
        @Inject('HomeAboutRepositoryInterface')
        private readonly homeAboutRepository: HomeAboutRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to execute the use case, taking the section ID and a updateHomeAboutSectionDto as input, deleting the old section and caching the updated one, and returning a Promise that resolves to the an object containing a success message and the updated home about section data
    async execute(homeAboutId: number, updateHomeAboutSectionDto: UpdateHomeAboutSectionDto, actor: ActorType): Promise<Object> {

        const sectionKey = 'home-about-section';
        const sectionTtl = (60000 * 60) * 24; // 24 hours in milliseconds

        try {

            this.logger.log('Veryfing user...');

            if (!actor || !actor.roles?.includes('admin')) {
                            
                throw new ForbiddenError('Você não tem permissão para executar esta ação.');
            }

            if (!updateHomeAboutSectionDto || Object.keys(updateHomeAboutSectionDto).length === 0) {
             
                throw new InvalidEntityError('Para atualizar, pelo menos um campo da seção deve ser preenchido.');
            }

            this.logger.log('User verified. Validating home about section...');

            // Validate the updated home about section DTO
            const errors = await validate(updateHomeAboutSectionDto, { stopAtFirstError: true });

            // If there are validation errors, throw an error
            if (errors.length > 0) {

                // Extract all constraint messages from validation errors
                // flatMap is used to flatten the array of arrays into a single array
                const messages = errors.flatMap(
                    err => Object.values(err.constraints || {}) // Get constraint messages or empty array
                );

                throw new InvalidEntityError(messages.join('; ')); // Join messages into a single string. Remember to properly format on frontend
            }
            
            this.logger.log('Updating home about section...');

            // Update the home about section in the repository
            const updatedHomeAboutSection = await this.homeAboutRepository.update(homeAboutId, updateHomeAboutSectionDto);

            if (!updatedHomeAboutSection) {

                console.log(updatedHomeAboutSection);

                this.logger.log('No section was updated.');
                throw new EntityNotFoundError('Nenhuma seção foi atualizada.');
            }

            this.logger.log('Section successfully updated on database. Deleting the old section from cache...');

            // Deleting the old cached section
            await this.cacheService.del(`${sectionKey}:${homeAboutId}`);

            this.logger.log('Old section deleted from cache. Caching the updated section...');

            // Caching updated section
            await this.cacheService.set<HomeAboutDto>(`${sectionKey}:${homeAboutId}`, updatedHomeAboutSection, sectionTtl);
    
            this.logger.log('Home about section cached successfully');
            
            return {
                success: true,
                message: 'Seção "Sobre nós" da Home atualizada com sucesso.',
                data: updatedHomeAboutSection,
            };
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error updating the home about section:', err);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao atualizar a seção "Sobre nós" da Home.');
        }
    }
}