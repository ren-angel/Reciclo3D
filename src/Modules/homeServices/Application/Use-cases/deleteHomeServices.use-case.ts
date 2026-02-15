import { Inject, Injectable, Logger } from "@nestjs/common";
import { CacheService } from "src/Modules/Shared/cache.service";
import { HomeServicesRepositoryInterface } from "../../Domain/Repositories/homeServices.repository.interface";
import { DeleteResult } from "typeorm";
import { DomainError, EntityNotFoundError, ForbiddenError, InfrastructureError, InvalidEntityError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

// Use case for deleting the home Services section
@Injectable()
export class DeleteHomeServicesSectionUseCase {

    // Injecting the home Services repository, Cache service and Logger using dependency injection for the use case to interact with the data layer, caching layer and log important information or errors
    constructor(
        @Inject('HomeServicesRepositoryInterface')
        private readonly homeServicesRepository: HomeServicesRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to execute the use case, taking the section ID as input, deleting the section from the database and cache, and returning a Promise that resolves to a object containing a success message
    async execute(homeServicesId: number, actor: ActorType): Promise<Object> {

        const sectionKey = 'home-services-section';

        try {

            this.logger.log('Veryfing user...');

            if (!actor || !actor.roles?.includes('admin')) {
                            
                throw new ForbiddenError('Você não tem permissão para executar esta ação.');
            }

            if (!homeServicesId) {
             
                throw new InvalidEntityError('ID da seção é obrigatório para remoção.');
            }

            this.logger.log('User verified. Deleting home Services section from the database...');
    
            // Deletes the Services section in the repository
            const deleted = await this.homeServicesRepository.remove(homeServicesId);

            if (!deleted) {

                this.logger.log('No section was deleted.');
                throw new EntityNotFoundError('Nenhuma seção foi removida.');
            }
            
            this.logger.log('Section successfully deleted from the database. Deleting the section from the cache...');

            // Deleting the section on cache
            await this.cacheService.del(`${sectionKey}:${homeServicesId}`);
            
            this.logger.log('Cached section successfully deleted');
            
            return {
                message: 'Seção "Serviços" da Home removida com sucesso.',
            };
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error deleting the home Services section:', err.message);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao remover a seção "Serviços" da Home.');
        }
    }
}
