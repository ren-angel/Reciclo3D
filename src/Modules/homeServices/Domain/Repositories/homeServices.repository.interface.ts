import { HomeServicesDto } from "../../Application/DTO/homeServices.dto";
import { CreateHomeServicesSectionDto } from "src/Modules/homeServices/Interfaces/DTOs/create-homeServices.dto";
import { UpdateHomeServicesSectionDto } from "src/Modules/homeServices/Interfaces/DTOs/update-homeServices.dto";
import { DeleteResult } from "typeorm";

// Interface defining the contract for Services repository operations
export interface HomeServicesRepositoryInterface {

    // Method for retrieving the home "Services" section by its ID using the provided DTO, returning a Promise that resolves to the HomeServicesDto or null if not found
    find(): Promise<HomeServicesDto[] | null>;

    // Method for creating a new home "Services" section using the provided DTO and returning a Promise that resolves to the created ServicesEntity
    create(createHomeServicesSectionDto: CreateHomeServicesSectionDto): Promise<HomeServicesDto>;

    // Method for updating an existing home "Services" section identified by its ID using the provided DTO, returning a Promise that resolves to an UpdateResult or null if the update fails
    update(homeServicesId: number, updateHomeServicesSectionDto: UpdateHomeServicesSectionDto): Promise<HomeServicesDto | null>;

    // Method for deleting an home "Services" section by its ID, returning a Promise that resolves to a DeleteResult or null if the deletion fails
    remove(homeServicesId: number): Promise<DeleteResult | null>;
}