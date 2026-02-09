import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AboutController } from './Interfaces/Controllers/about.controller';
import { AboutEntity } from './Domain/Entities/about.entity';
import { AdminModule } from '../Admin/admin.module';
import { FindAllAboutSectionsUseCase } from './Application/Use-cases/findAllAboutSections.use-case';
import { FindOneAboutSectionsUseCase } from './Application/Use-cases/findOneAboutSections.use-case';
import { CreateAboutSectionUseCase } from './Application/Use-cases/createAboutSection.use-case';
import { UpdateAboutSectionUseCase } from './Application/Use-cases/updateAboutSection.use-case';
import { DeleteAboutSectionUseCase } from './Application/Use-cases/deleteAboutSection.use-case';
import { AboutRepositoryInterface } from './Domain/Repositories/about.repository.interface';
import { TypeOrmAboutRepository } from './Infrastructure/Persistence/about.repository';

// Module definition for the About section of the application
@Module({
  imports: [TypeOrmModule.forFeature([AboutEntity]), AdminModule], // Importing TypeOrmModule with AboutEntity for database operations and AdminModule for authentication and authorization
  providers: [
    {
      provide: 'AboutRepositoryInterface', // Providing the AboutRepositoryInterface with its TypeORM implementation
      useClass: TypeOrmAboutRepository, // Mapping interface to concrete class. So whenever AboutRepositoryInterface is needed, the TypeOrmAboutRepository class will be used instead, enabling dependency injection
    },
    
    // Use case providers for handling business logic related to about sections
    FindAllAboutSectionsUseCase,
    FindOneAboutSectionsUseCase,
    CreateAboutSectionUseCase,
    UpdateAboutSectionUseCase,
    DeleteAboutSectionUseCase,
  ],
  controllers: [AboutController], // Registering the AboutController to handle incoming HTTP requests
})

export class AboutModule {}