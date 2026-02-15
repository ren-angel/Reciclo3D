import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeServicesController } from './Interfaces/Controllers/homeServices.controller';
import { HomeServicesEntity } from './Domain/Entities/homeServices.entity';
import { AdminModule } from '../Admin/admin.module';
import { FindHomeServicesSectionsUseCase } from './Application/Use-cases/findHomeServices.use-case';
import { CreateHomeServicesSectionUseCase } from './Application/Use-cases/createHomeServices.use-case';
import { UpdateHomeServicesSectionUseCase } from './Application/Use-cases/updateHomeServices.use-case';
import { DeleteHomeServicesSectionUseCase } from './Application/Use-cases/deleteHomeServices.use-case';
import { HomeServicesRepositoryInterface } from './Domain/Repositories/homeServices.repository.interface';
import { TypeOrmHomeServicesRepository } from './Infrastructure/Persistence/homeServices.repository';

// Module definition for the home Services section of the application
@Module({
  imports: [TypeOrmModule.forFeature([HomeServicesEntity]), AdminModule], // Importing TypeOrmModule with HomeServicesEntity for database operations and AdminModule for authentication and authorization
  providers: [
    {
      provide: 'HomeServicesRepositoryInterface', // Providing the HomeServicesRepositoryInterface with its TypeORM implementation
      useClass: TypeOrmHomeServicesRepository, // Mapping interface to concrete class. So whenever HomeServicesRepositoryInterface is needed, the TypeOrmHomeServicesRepository class will be used instead, enabling dependency injection
    },
    
    // Use case providers for handling business logic related to Services sections
    FindHomeServicesSectionsUseCase,
    CreateHomeServicesSectionUseCase,
    UpdateHomeServicesSectionUseCase,
    DeleteHomeServicesSectionUseCase,
  ],
  controllers: [HomeServicesController], // Registering the HomeServicesController to handle incoming HTTP requests
})

export class HomeServicesModule {}