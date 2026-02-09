import { AboutEntity } from "../Entities/about.entity";
import { AboutDto } from "../../Application/DTO/about.dto";
import { CreateAboutSectionDto } from "src/Modules/About/Interfaces/DTOs/create-about-section.dto";
import { UpdateAboutSectionDto } from "src/Modules/About/Interfaces/DTOs/update-about-section.dto";
import { DeleteResult, UpdateResult } from "typeorm";

// Interface defining the contract for About repository operations
export interface AboutRepositoryInterface {

    // Method for retrieving the IDs of all About sections, returning a Promise that resolves to an array of numbers
    findAllIds(): Promise<number[]>;

    // Method for retrieving all About sections using the provided DTO, returning a Promise that resolves to an array of AboutDto or null if none exist
    findById(ids: number[]): Promise<AboutDto[] | null>;

    // Method for retrieving a specific About section by its ID using the provided DTO, returning a Promise that resolves to the AboutDto or null if not found
    findOne(aboutId: number): Promise<AboutDto | null>;

    // Method for creating a new About section using the provided DTO and returning a Promise that resolves to the created AboutEntity
    create(createAboutSectionDto: CreateAboutSectionDto): Promise<AboutDto>;

    // Method for updating an existing About section identified by its ID using the provided DTO, returning a Promise that resolves to an UpdateResult or null if the update fails
    update(aboutId: number, updateAboutSectionDto: UpdateAboutSectionDto): Promise<AboutDto | null>;

    // Method for deleting an About section by its ID, returning a Promise that resolves to a DeleteResult or null if the deletion fails
    remove(aboutId: number): Promise<DeleteResult | null>;
}