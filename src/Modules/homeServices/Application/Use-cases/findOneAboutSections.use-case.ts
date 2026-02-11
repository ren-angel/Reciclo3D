import { Inject, Injectable, Logger } from "@nestjs/common";
import { CacheService } from "src/Modules/Shared/cache.service";
import { AboutRepositoryInterface } from "../../Domain/Repositories/about.repository.interface";
import { AboutDto } from "../DTO/about.dto";
import { DomainError, ForbiddenError, InfrastructureError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

@Injectable()
export class FindOneAboutSectionsUseCase {

    constructor(
        @Inject('AboutRepositoryInterface')
        private readonly aboutRepository: AboutRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to find one about section by its ID, utilizing caching to optimize performance
    async execute(aboutId: number, actor: ActorType): Promise<AboutDto | null> {

        const sectionKey = 'about-section';
        const lockTtl = 2000; // 2 seconds in milliseconds. Lock has to last longer than the function it's running
        const sectionTtl = (60000 * 60) * 24; // 24 hours in milliseconds

        try {

            this.logger.log('Veryfing user...');

            if (!actor || !actor.roles?.includes('admin')) {
                            
                throw new ForbiddenError('Você não tem permissão para executar esta ação.');
            }

            this.logger.log('User verified. Fetching the about section from cache...');

            // Fetching the section from cache
            const cachedSection = await this.cacheService.get<AboutDto>(`${sectionKey}:${aboutId}`);

            // If found in cache, return it immediately
            if (cachedSection) {
                
                this.logger.log('Section fetched from cache successfully.');

                return cachedSection;
            }

            this.logger.log('Section not found on cache. Fetching the section from repository...');
            
            // Fetching the section from repository using lock to prevent cache stampede
            const databaseSection = await this.cacheService.withLock(
                `read:${sectionKey}:${aboutId}`,
                lockTtl,
                async () => await this.aboutRepository.findOne(aboutId)
            );

            // If no section is found, return null
            if (!databaseSection) {

                this.logger.log('No section was found in repository.');
                return null;
            }

            this.logger.log('About section fetched successfully. Caching the result...');

            // Caching the fetched section for future requests
            await this.cacheService.set<AboutDto>(`${sectionKey}:${aboutId}`, databaseSection, sectionTtl);

            this.logger.log('About section cached successfully.');

            return databaseSection;
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error fetching the about section:', err);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao obter a seção de "Sobre nós".');
        }
    }
}