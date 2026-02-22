import { HomeAboutDto } from "../../Application/DTO/homeAbout.dto";
import { CreateHomeAboutSectionDto } from "src/Modules/homeAbout/Interfaces/DTOs/create-homeAbout.dto";
import { UpdateHomeAboutSectionDto } from "src/Modules/homeAbout/Interfaces/DTOs/update-homeAbout.dto";
import { DeleteResult } from "typeorm";

// Interface defining the contract for About repository operations
export interface HomeAboutRepositoryInterface {

    // Method for retrieving the home "About" section by its ID using the provided DTO, returning a Promise that resolves to the HomeAboutDto or null if not found
    find(): Promise<HomeAboutDto[] | null>;

    // Method for creating a new home "About" section using the provided DTO and returning a Promise that resolves to the created AboutEntity
    create(createHomeAboutSectionDto: CreateHomeAboutSectionDto): Promise<HomeAboutDto>;

    // Method for updating an existing home "About" section identified by its ID using the provided DTO, returning a Promise that resolves to an UpdateResult or null if the update fails
    update(homeAboutId: number, updateHomeAboutSectionDto: UpdateHomeAboutSectionDto): Promise<HomeAboutDto | null>;

    // Method for deleting an home "About" section by its ID, returning a Promise that resolves to a DeleteResult or null if the deletion fails
    remove(homeAboutId: number): Promise<DeleteResult | null>;
}