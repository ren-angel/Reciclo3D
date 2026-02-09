import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminRepositoryInterface } from "../../Domain/Repositories/admin.repository.interface";
import { AdminEntity } from "../../Domain/Entities/admin.entity";

// Implementation of the AdminRepositoryInterface using TypeORM for database operations
@Injectable()
export class TypeOrmAdminRepository implements AdminRepositoryInterface {

  // Injecting the TypeORM repository for the AdminEntity to perform database operations related to admin users
  constructor(
    @InjectRepository(AdminEntity) private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  // Method to find an admin user by their email and password, returning a Promise that resolves to an AdminEntity if found, or null if no matching user is found in the database
  findOne(adminEmail: string, adminPassword: string): Promise<AdminEntity | null> {

    return this.adminRepository.findOne({ where: { adminEmail, adminPassword } });
  }
}