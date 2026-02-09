import { AdminEntity } from "../Entities/admin.entity";

// Interface defining the contract for Admin repository operations
export interface AdminRepositoryInterface {
    
    // Method to find a user by email and password, returning a Promise that resolves to a AdminEntity or null if not found
    findOne(adminEmail: string, adminPassword: string): Promise<AdminEntity | null>;
}