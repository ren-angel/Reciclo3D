import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, EntityManager, In, Repository, UpdateResult } from "typeorm";
import { plainToInstance } from "class-transformer";
import { HomeAboutRepositoryInterface } from "src/Modules/homeAbout/Domain/Repositories/homeAbout.repository.interface";
import { HomeAboutEntity } from "../../Domain/Entities/homeAbout.entity";
import { HomeAboutDto } from "../../Application/DTO/homeAbout.dto";
import { CreateHomeAboutSectionDto } from "src/Modules/homeAbout/Interfaces/DTOs/create-homeAbout.dto";
import { UpdateHomeAboutSectionDto } from "src/Modules/homeAbout/Interfaces/DTOs/update-homeAbout.dto";

// Implementation of the HomeAboutRepositoryInterface using TypeORM for database operations
@Injectable()
export class TypeOrmHomeAboutRepository implements HomeAboutRepositoryInterface {

    // Injecting the TypeORM repository for the HomeAboutEntity, with the private access modifier to create and initialize the homeAboutRepository property, and readonly to prevent reassignment after initialization
    constructor(
        @InjectRepository(HomeAboutEntity) private readonly homeAboutRepository: Repository<HomeAboutEntity>,
    ) {}
    
    // Method to retrieve the home about section
    async find(): Promise<HomeAboutDto[] | null> {
        
        const aboutSection = await this.homeAboutRepository.find();
        
        return plainToInstance(HomeAboutDto, aboutSection);
    }

    // Method to create and save a new home about section in the database
    async create(createHomeAboutSectionDto: CreateHomeAboutSectionDto): Promise<HomeAboutDto> {

        // Creates a new about section entity from the provided DTO and saves it to the database        
        const newAboutSection = await this.homeAboutRepository.save(createHomeAboutSectionDto);

        return plainToInstance(HomeAboutDto, newAboutSection);
    }

    // Method to update the home about section by its ID
    async update(homeAboutId: number, updateHomeAboutSectionDto: UpdateHomeAboutSectionDto): Promise<HomeAboutDto | null> {

        // Checks if entity exists and replaces it
        const preload = await this.homeAboutRepository.preload({
            homeAboutId: homeAboutId,
            ...updateHomeAboutSectionDto,
        });

        if (!preload) return null; // entity not found

        const updated = await this.homeAboutRepository.save(preload);

        return plainToInstance(HomeAboutDto, updated);
    }

    // Method to remove the home about section by its ID
    async remove(homeAboutId: number): Promise<DeleteResult> {

        const section = await this.homeAboutRepository.findOneBy({ homeAboutId });

        // If the section doesn't exist, set affected rows to 0 and exit
        if (!section) {

            return null;
        }

        const deleteResult = await this.homeAboutRepository.delete(homeAboutId);

        return deleteResult!; // ! = non-null assertion because we know it exists
    }
}