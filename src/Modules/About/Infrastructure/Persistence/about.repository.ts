import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, EntityManager, In, Repository, UpdateResult } from "typeorm";
import { plainToInstance } from "class-transformer";
import { AboutRepositoryInterface } from "src/Modules/About/Domain/Repositories/about.repository.interface";
import { AboutEntity } from "../../Domain/Entities/about.entity";
import { AboutDto } from "../../Application/DTO/about.dto";
import { CreateAboutSectionDto } from "src/Modules/About/Interfaces/DTOs/create-about-section.dto";
import { UpdateAboutSectionDto } from "src/Modules/About/Interfaces/DTOs/update-about-section.dto";

// Implementation of the AboutRepositoryInterface using TypeORM for database operations
@Injectable()
export class TypeOrmAboutRepository implements AboutRepositoryInterface {

    // Injecting the TypeORM repository for the AboutEntity, with the private access modifier to create and initialize the aboutRepository property, and readonly to prevent reassignment after initialization
    constructor(
        @InjectRepository(AboutEntity) private readonly aboutRepository: Repository<AboutEntity>,
    ) {}
    
    // Method to retrieve all about section IDs from the database
    async findAllIds(): Promise<number[]> {
        
        const aboutSections = await this.aboutRepository.find({ select: ['aboutId'] });
        
        return aboutSections.map(section => section.aboutId);
    }

    // Method to retrieve all about sections from the database
    async findById(ids: number[]): Promise<AboutDto[] | null> {
        
        // const aboutSections = this.aboutRepository.find({ order: { sectionPosition: 'ASC' }, where: { aboutId: In(ids) } });
        const aboutSections = await this.aboutRepository.find({ where: { aboutId: In(ids) } });
        
        return plainToInstance(AboutDto, aboutSections);
    }
    
    // Method to retrieve a single about section by its ID
    async findOne(aboutId: number): Promise<AboutDto | null> {
        
        const aboutSection = await this.aboutRepository.findOne({ where: { aboutId } });
        
        return plainToInstance(AboutDto, aboutSection);
    }

    // Method to create and save a new about section in the database
    async create(createAboutSectionDto: CreateAboutSectionDto): Promise<AboutDto> {

        // Creates a new about section entity from the provided DTO and saves it to the database        
        const newAboutSection = await this.aboutRepository.save(createAboutSectionDto);

        return plainToInstance(AboutDto, newAboutSection);
    }

    // Method to update an existing about section by its ID
    async update(aboutId: number, updateAboutSectionDto: UpdateAboutSectionDto): Promise<AboutDto | null> {

        // Checks if entity exists and replaces it
        const preload = await this.aboutRepository.preload({
            aboutId: aboutId,
            ...updateAboutSectionDto,
        });

        if (!preload) return null; // entity not found

        const updated = await this.aboutRepository.save(preload);

        return plainToInstance(AboutDto, updated);
    }

    // Method to remove an about section by its ID
    async remove(aboutId: number): Promise<DeleteResult> {

        const section = await this.aboutRepository.findOneBy({ aboutId });

        // If the section doesn't exist, set affected rows to 0 and exit
        if (!section) {

            return null;
        }

        const deleteResult = await this.aboutRepository.delete(aboutId);

        return deleteResult!; // ! = non-null assertion because we know it exists
    }
}