import { Inject, Injectable, Logger } from "@nestjs/common";
import { CacheService } from "src/Modules/Shared/cache.service";
import { HomeAboutRepositoryInterface } from "../../Domain/Repositories/homeAbout.repository.interface";
import { HomeAboutDto } from "../DTO/homeAbout.dto";
import { DomainError, ForbiddenError, InfrastructureError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

@Injectable()
export class FindHomeAboutSectionsUseCase {

    constructor(
        @Inject('HomeAboutRepositoryInterface')
        private readonly homeAboutRepository: HomeAboutRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to find the home about section by its ID, and returning a Promise that resolves to a object containing a success message and the found about section data
    async execute(): Promise<Object | null> {

        const sectionKey = 'home-about-section';
        const lockTtl = 2000; // 2 seconds in milliseconds. Lock has to last longer than the function it's running
        const sectionTtl = (60000 * 60) * 24; // 24 hours in milliseconds

        try {

            this.logger.log('Fetching the home about section from cache...');

            // Fetching the section from cache
            const cachedSection = await this.cacheService.get<HomeAboutDto>(`${sectionKey}`);

            // If found in cache, return it immediately
            if (cachedSection) {
                
                this.logger.log('Section fetched from cache successfully.');

                return {
                    message: 'Seção "Sobre nós" da Home obtida com sucesso.',
                    section: cachedSection,
                };
            }

            this.logger.log('Section not found on cache. Fetching the section from repository...');
            
            // Fetching the section from repository using lock to prevent cache stampede
            const databaseHomeAboutSection = await this.cacheService.withLock(
                `read:${sectionKey}`,
                lockTtl,
                async () => await this.homeAboutRepository.find()
            );

            // If no section is found, return null
            if (!databaseHomeAboutSection) {

                this.logger.log('No section was found in repository.');
                return null;
            }

            this.logger.log('Home about section fetched successfully. Caching the result...');

            // Caching the fetched section for future requests
            await this.cacheService.set<HomeAboutDto>(`${sectionKey}`, databaseHomeAboutSection[0], sectionTtl);

            this.logger.log('Home about section cached successfully.');

            return {
                message: 'Seção "Sobre nós" da Home obtida com sucesso.',
                section: databaseHomeAboutSection[0],
            };
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error fetching the home about section:', err);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao obter a seção "Sobre nós" da Home.');
        }
    }
}
