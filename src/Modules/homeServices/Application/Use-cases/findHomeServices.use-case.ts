import { Inject, Injectable, Logger } from "@nestjs/common";
import { CacheService } from "src/Modules/Shared/cache.service";
import { HomeServicesRepositoryInterface } from "../../Domain/Repositories/homeServices.repository.interface";
import { HomeServicesDto } from "../DTO/homeServices.dto";
import { DomainError, ForbiddenError, InfrastructureError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

@Injectable()
export class FindHomeServicesSectionsUseCase {

    constructor(
        @Inject('HomeServicesRepositoryInterface')
        private readonly homeServicesRepository: HomeServicesRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to find the home Services section by its ID, and returning a Promise that resolves to a object containing a success message and the found Services section data
    async execute(): Promise<Object | null> {

        const sectionKey = 'home-services-section';
        const lockTtl = 2000; // 2 seconds in milliseconds. Lock has to last longer than the function it's running
        const sectionTtl = (60000 * 60) * 24; // 24 hours in milliseconds

        try {

            this.logger.log('Fetching the home Services section from cache...');

            // Fetching the section from cache
            const cachedSection = await this.cacheService.get<HomeServicesDto>(`${sectionKey}`);

            // If found in cache, return it immediately
            if (cachedSection) {
                
                this.logger.log('Section fetched from cache successfully.');

                return {
                    message: 'Seção "Serviços" da Home obtida com sucesso.',
                    section: cachedSection,
                };
            }

            this.logger.log('Section not found on cache. Fetching the section from repository...');
            
            // Fetching the section from repository using lock to prevent cache stampede
            const databaseHomeServicesSection = await this.cacheService.withLock(
                `read:${sectionKey}`,
                lockTtl,
                async () => await this.homeServicesRepository.find()
            );

            // If no section is found, return null
            if (!databaseHomeServicesSection) {

                this.logger.log('No section was found in repository.');
                return null;
            }

            this.logger.log('Home Services section fetched successfully. Caching the result...');

            // Caching the fetched section for future requests
            await this.cacheService.set<HomeServicesDto>(`${sectionKey}`, databaseHomeServicesSection[0], sectionTtl);

            this.logger.log('Home Services section cached successfully.');

            return {
                message: 'Seção "Serviços" da Home obtida com sucesso.',
                section: databaseHomeServicesSection[0],
            };
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error fetching the home Services section:', err);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao obter a seção "Serviços" da Home.');
        }
    }
}
