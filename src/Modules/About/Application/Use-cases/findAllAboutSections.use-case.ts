import { Inject, Injectable, Logger } from "@nestjs/common";
import { AboutRepositoryInterface } from "../../Domain/Repositories/about.repository.interface";
import { AboutDto } from "../DTO/about.dto";
import { CacheService } from "src/Modules/Shared/cache.service";
import { DomainError, ForbiddenError, InfrastructureError } from "src/Modules/Shared/custom-errors.exception";
import { Actor as ActorType } from "src/Modules/Shared/actor.interface";

@Injectable()
export class FindAllAboutSectionsUseCase {

    constructor(
        @Inject('AboutRepositoryInterface')
        private readonly aboutRepository: AboutRepositoryInterface,
        private readonly cacheService: CacheService,
        private readonly logger: Logger,
    ) {}

    // Method to execute the use case, fetching all about sections, caching the result, and returning a Promise that resolves to an array of AboutEntity
    async execute(actor: ActorType): Promise<AboutDto[] | null> {

        const listKey = 'about-sections:list';
        const sectionKey = 'about-section';
        const lockTtl = 2000; // 2 seconds in milliseconds. Lock has to last longer than the function it's running
        const sectionTtl = (60000 * 60) * 24; // 24 hours in milliseconds

        try {

            this.logger.log('Veryfing user...');

            if (!actor || !actor.roles?.includes('admin')) {
                
                throw new ForbiddenError('Você não tem permissão para executar esta ação.');
            }

            this.logger.log('User verified. Fetching all about sections IDs from cache...');
        
            // Getting the cached IDs
            const rawAboutSectionsIds = await this.cacheService.lrange(listKey); // returns strings
            let aboutSectionsIds = rawAboutSectionsIds.map(id => Number(id)); // convert to numbers

            // Validate if there are duplicate IDs in the cached list. Set is a collection of unique values, so if sizes differ, there are duplicates
            const hasDuplicates = new Set(aboutSectionsIds).size !== aboutSectionsIds.length;

            // if couldn't find any cached IDs or there are duplicate IDs on the list, then fetch IDs from the repository and create/recreate list
            if (!aboutSectionsIds || aboutSectionsIds.length === 0 || hasDuplicates) {

                this.logger.log('Sections IDs not found/duplicates in cache. Fetching from repository...');

                // First, acquire a lock to prevent cache stampede
                aboutSectionsIds = await this.cacheService.withLock(
                    `read:${listKey}`,
                    lockTtl,
                    async () => {
                        const ids = await this.aboutRepository.findAllIds()

                        if (ids.length > 0) {

                            this.logger.log('Sections IDs fetched successfully. Caching the result...');

                            // Rebuilds the cache list with the fetched IDs
                            await this.cacheService.ldel(listKey)
                            
                            // Push each ID to the list in cache, as to not store the entire array as a single entry
                            for (const id of ids) {

                                await this.cacheService.rpush(listKey, id.toString(), sectionTtl);
                            }

                            this.logger.log('Sections IDs cached successfully.');
                        } else {

                            // If no IDs are found, return null
                            this.logger.log('No about sections found in repository.');
                            return null;
                        }

                        return ids;
                    },
                );
            }

            this.logger.log('Fetching all about sections from cache...');

            // Creating keys for each section based on their IDs
            const keys = aboutSectionsIds.map(id => `${sectionKey}:${id}`);

            // Attempt to fetch all sections from cache using mget for efficiency
            const cachedArr = await this.cacheService.mget<AboutDto | null>(keys);

            // Since in create sections we only push the ID to the list, but remove every section from cache for being stale info because of positioning, meanwhile normal updates that doesn't affect positioning are cached right after said update, the cache will always be either empty or complete, so if there's any null, we can assume the cache is incomplete and fetch all from repository
            if (cachedArr.every(item => item !== null && item !== undefined)) {

                this.logger.log('About sections fetched from cache successfully.');

                return cachedArr as AboutDto[];
            }

            // If no sections are found in cache, fetch all from repository
            this.logger.log('No sections found in cache. Fetching from repository...');

            const aboutSections = await this.aboutRepository.findById(aboutSectionsIds);

            // If no sections are found in repository, return null
            if (!aboutSections || aboutSections.length === 0) return null

            this.logger.log('About sections fetched successfully. Caching the result...');

            // Creating the payload for setting multiple values in the cache, mapping through each section
            const msetPayload = aboutSections.map(section => ({
                key: `${sectionKey}:${section.aboutId}`,
                value: section,
            }));

            // Caching the missing sections in bulk
            await this.cacheService.mset<AboutDto>(msetPayload, sectionTtl);

            this.logger.log('About sections cached successfully.');

            return aboutSections;
        } catch (err) {

            // Log the error and rethrow a generic error message
            this.logger.error('Error fetching all the about sections:', err);

            // If it's a known/domain/internal expected error, rethrow
            if (err instanceof DomainError || (err && (err as any).isDomainError)) {

                throw err;
            }

            // Otherwise, it's unexpected -> generic error
            throw new InfrastructureError('Erro ao obter as seções "Sobre nós".');
        }
    }
}