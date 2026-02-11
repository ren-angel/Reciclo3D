import { Controller, UseGuards, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateAboutSectionDto } from '../DTOs/create-about-section.dto';
import { UpdateAboutSectionDto } from '../DTOs/update-about-section.dto';

import { FindAllAboutSectionsUseCase } from '../../Application/Use-cases/findAllAboutSections.use-case';
import { FindOneAboutSectionsUseCase } from '../../Application/Use-cases/findOneAboutSections.use-case';
import { CreateAboutSectionUseCase } from '../../Application/Use-cases/createAboutSection.use-case';
import { UpdateAboutSectionUseCase } from '../../Application/Use-cases/updateAboutSection.use-case';
import { DeleteAboutSectionUseCase } from '../../Application/Use-cases/deleteAboutSection.use-case';
import { seconds, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/Modules/Shared/jwt.guard';
import { Actor } from 'src/Modules/Shared/actor.decorator';
import type { Actor as ActorType } from 'src/Modules/Shared/actor.interface';

// Applying the JwtAuthGuard to the entire controller to protect all endpoints with JWT authentication
@UseGuards(JwtAuthGuard)

// Controller for managing about sections, handling HTTP requests and delegating to use cases
@Controller('about')
@Throttle({ default: { limit: 30, ttl: seconds(60) } }) // Overriding the default throttling for this specific controller 
export class AboutController {

  // Injecting the necessary use cases for handling about section operations
  constructor(
    private readonly findAllAboutSectionsUseCase: FindAllAboutSectionsUseCase,
    private readonly findOneAboutSectionsUseCase: FindOneAboutSectionsUseCase,
    private readonly createAboutSectionUseCase: CreateAboutSectionUseCase,
    private readonly updateAboutSectionUseCase: UpdateAboutSectionUseCase,
    private readonly deleteAboutSectionUseCase: DeleteAboutSectionUseCase,
  ) {}

  // Endpoint to retrieve all about sections
  @Get()
  findAll(@Actor() actor: ActorType) {

    return this.findAllAboutSectionsUseCase.execute(actor);
  }

  // Endpoint to retrieve a single about section by its ID
  @Get(':aboutId')
  findOne(
    @Param('aboutId') aboutId: string,
    @Actor() actor: ActorType,
  ) {

    // + operator to convert string to number
    return this.findOneAboutSectionsUseCase.execute(+aboutId, actor);
  }

  // Endpoint to create a new about section
  @Post()
  create(
    @Body() createAboutSectionDto: CreateAboutSectionDto,
    @Actor() actor: ActorType,
  ) {

    return this.createAboutSectionUseCase.execute(createAboutSectionDto, actor);
  }

  // Endpoint to update an existing about section by its ID
  @Put(':aboutId')
  update(
    @Param('aboutId') aboutId: string,
    @Body() updateAboutSectionDto: UpdateAboutSectionDto,
    @Actor() actor: ActorType,
  ) {

    // + operator to convert string to number
    return this.updateAboutSectionUseCase.execute(+aboutId, updateAboutSectionDto, actor);
  }

  // Endpoint to delete an about section by its ID
  @Delete(':aboutId')
  remove(
    @Param('aboutId') aboutId: string,
    @Actor() actor: ActorType,
  ) {
    
    // + operator to convert string to number
    return this.deleteAboutSectionUseCase.execute(+aboutId, actor);
  }
}