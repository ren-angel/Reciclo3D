import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeAboutController } from './Interfaces/Controllers/about.controller';
import { HomeAboutEntity } from './Domain/Entities/homeAbout.entity';
import { AdminModule } from '../Admin/admin.module';
import { FindHomeAboutSectionsUseCase } from './Application/Use-cases/findHomeAboutSections.use-case';
import { CreateHomeAboutSectionUseCase } from './Application/Use-cases/createHomeAboutSection.use-case';
import { UpdateHomeAboutSectionUseCase } from './Application/Use-cases/updateHomeAboutSection.use-case';
import { DeleteHomeAboutSectionUseCase } from './Application/Use-cases/deleteHomeAboutSection.use-case';
import { HomeAboutRepositoryInterface } from './Domain/Repositories/homeAbout.repository.interface';
import { TypeOrmHomeAboutRepository } from './Infrastructure/Persistence/homeAbout.repository';

// Module definition for the home about section of the application
@Module({
  imports: [TypeOrmModule.forFeature([HomeAboutEntity]), AdminModule], // Importing TypeOrmModule with HomeAboutEntity for database operations and AdminModule for authentication and authorization
  providers: [
    {
      provide: 'HomeAboutRepositoryInterface', // Providing the HomeAboutRepositoryInterface with its TypeORM implementation
      useClass: TypeOrmHomeAboutRepository, // Mapping interface to concrete class. So whenever HomeAboutRepositoryInterface is needed, the TypeOrmHomeAboutRepository class will be used instead, enabling dependency injection
    },
    
    // Use case providers for handling business logic related to about sections
    FindHomeAboutSectionsUseCase,
    CreateHomeAboutSectionUseCase,
    UpdateHomeAboutSectionUseCase,
    DeleteHomeAboutSectionUseCase,
  ],
  controllers: [HomeAboutController], // Registering the HomeAboutController to handle incoming HTTP requests
})

export class HomeAboutModule {}