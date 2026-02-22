import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, EntityManager, In, Repository, UpdateResult } from "typeorm";
import { plainToInstance } from "class-transformer";
import { HomeServicesRepositoryInterface } from "src/Modules/homeServices/Domain/Repositories/homeServices.repository.interface";
import { HomeServicesEntity } from "../../Domain/Entities/homeServices.entity";
import { HomeServicesDto } from "../../Application/DTO/homeServices.dto";
import { CreateHomeServicesSectionDto } from "src/Modules/homeServices/Interfaces/DTOs/create-homeServices.dto";
import { UpdateHomeServicesSectionDto } from "src/Modules/homeServices/Interfaces/DTOs/update-homeServices.dto";

// Implementation of the HomeServicesRepositoryInterface using TypeORM for database operations
@Injectable()
export class TypeOrmHomeServicesRepository implements HomeServicesRepositoryInterface {

    // Injecting the TypeORM repository for the HomeServicesEntity, with the private access modifier to create and initialize the homeServicesRepository property, and readonly to prevent reassignment after initialization
    constructor(
        @InjectRepository(HomeServicesEntity) private readonly homeServicesRepository: Repository<HomeServicesEntity>,
    ) {}
    
    // Method to retrieve the home Services section
    async find(): Promise<HomeServicesDto[] | null> {
        
        const servicesSection = await this.homeServicesRepository.find();
        
        return plainToInstance(HomeServicesDto, servicesSection);
    }

    // Method to create and save a new home Services section in the database
    async create(createHomeServicesSectionDto: CreateHomeServicesSectionDto): Promise<HomeServicesDto> {

        // Creates a new Services section entity from the provided DTO and saves it to the database        
        const newServicesSection = await this.homeServicesRepository.save(createHomeServicesSectionDto);

        return plainToInstance(HomeServicesDto, newServicesSection);
    }

    // Method to update the home Services section by its ID
    async update(homeServicesId: number, updateHomeServicesSectionDto: UpdateHomeServicesSectionDto): Promise<HomeServicesDto | null> {

        // Checks if entity exists and replaces it
        const preload = await this.homeServicesRepository.preload({
            homeServicesId: homeServicesId,
            ...updateHomeServicesSectionDto,
        });

        if (!preload) return null; // entity not found

        const updated = await this.homeServicesRepository.save(preload);

        return plainToInstance(HomeServicesDto, updated);
    }

    // Method to remove the home Services section by its ID
    async remove(homeServicesId: number): Promise<DeleteResult> {

        const section = await this.homeServicesRepository.findOneBy({ homeServicesId });

        // If the section doesn't exist, set affected rows to 0 and exit
        if (!section) {

            return null;
        }

        const deleteResult = await this.homeServicesRepository.delete(homeServicesId);

        return deleteResult!; // ! = non-null assertion because we know it exists
    }
}