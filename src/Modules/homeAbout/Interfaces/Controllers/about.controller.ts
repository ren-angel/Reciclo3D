import { Controller, UseGuards, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateHomeAboutSectionDto } from '../DTOs/create-homeAbout-section.dto';
import { UpdateHomeAboutSectionDto } from '../DTOs/update-homeAbout-section.dto';

import { FindHomeAboutSectionsUseCase } from '../../Application/Use-cases/findHomeAboutSections.use-case';
import { CreateHomeAboutSectionUseCase } from '../../Application/Use-cases/createHomeAboutSection.use-case';
import { UpdateHomeAboutSectionUseCase } from '../../Application/Use-cases/updateHomeAboutSection.use-case';
import { DeleteHomeAboutSectionUseCase } from '../../Application/Use-cases/deleteHomeAboutSection.use-case';
import { seconds, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/Modules/Shared/jwt.guard';
import { Actor } from 'src/Modules/Shared/actor.decorator';
import type { Actor as ActorType } from 'src/Modules/Shared/actor.interface';

// Applying the JwtAuthGuard to the entire controller to protect all endpoints with JWT authentication
@UseGuards(JwtAuthGuard)

// Controller for managing about sections, handling HTTP requests and delegating to use cases
@Controller('homeAbout')
@Throttle({ default: { limit: 30, ttl: seconds(60) } }) // Overriding the default throttling for this specific controller 
export class HomeAboutController {

  // Injecting the necessary use cases for handling about section operations
  constructor(
    private readonly findHomeAboutSectionsUseCase: FindHomeAboutSectionsUseCase,
    private readonly createHomeAboutSectionUseCase: CreateHomeAboutSectionUseCase,
    private readonly updateHomeAboutSectionUseCase: UpdateHomeAboutSectionUseCase,
    private readonly deleteHomeAboutSectionUseCase: DeleteHomeAboutSectionUseCase,
  ) {}

  // Endpoint to retrieve the home about section by its ID
  @Get(':homeAboutId')
  findOne(
    @Param('homeAboutId') aboutId: string,
    @Actor() actor: ActorType,
  ) {

    // + operator to convert string to number
    return this.findHomeAboutSectionsUseCase.execute(+aboutId, actor);
  }

  // Endpoint to create a new home about section
  @Post()
  create(
    @Body() createHomeAboutSectionDto: CreateHomeAboutSectionDto,
    @Actor() actor: ActorType,
  ) {

    return this.createHomeAboutSectionUseCase.execute(createHomeAboutSectionDto, actor);
  }

  // Endpoint to update the existing home about section by its ID
  @Put(':homeAboutId')
  update(
    @Param('homeAboutId') homeAboutId: string,
    @Body() updateHomeAboutSectionDto: UpdateHomeAboutSectionDto,
    @Actor() actor: ActorType,
  ) {

    // + operator to convert string to number
    return this.updateHomeAboutSectionUseCase.execute(+homeAboutId, updateHomeAboutSectionDto, actor);
  }

  // Endpoint to delete the home about section by its ID
  @Delete(':homeAboutId')
  remove(
    @Param('homeAboutId') homeAboutId: string,
    @Actor() actor: ActorType,
  ) {
    
    // + operator to convert string to number
    return this.deleteHomeAboutSectionUseCase.execute(+homeAboutId, actor);
  }
}