import { Controller, UseGuards, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateHomeServicesSectionDto } from '../DTOs/create-homeServices.dto';
import { UpdateHomeServicesSectionDto } from '../DTOs/update-homeServices.dto';

import { FindHomeServicesSectionsUseCase } from '../../Application/Use-cases/findHomeServices.use-case';
import { CreateHomeServicesSectionUseCase } from '../../Application/Use-cases/createHomeServices.use-case';
import { UpdateHomeServicesSectionUseCase } from '../../Application/Use-cases/updateHomeServices.use-case';
import { DeleteHomeServicesSectionUseCase } from '../../Application/Use-cases/deleteHomeServices.use-case';
import { seconds, Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/Modules/Shared/jwt.guard';
import { Actor } from 'src/Modules/Shared/actor.decorator';
import type { Actor as ActorType } from 'src/Modules/Shared/actor.interface';

import { Public } from 'src/Modules/Shared/public.decorator';

// Applying the JwtAuthGuard to the entire controller to protect all endpoints with JWT authentication
@UseGuards(JwtAuthGuard)

// Controller for managing Services sections, handling HTTP requests and delegating to use cases
@Controller('homeServices')
@Throttle({ default: { limit: 30, ttl: seconds(60) } }) // Overriding the default throttling for this specific controller 
export class HomeServicesController {

  // Injecting the necessary use cases for handling Services section operations
  constructor(
    private readonly findHomeServicesSectionsUseCase: FindHomeServicesSectionsUseCase,
    private readonly createHomeServicesSectionUseCase: CreateHomeServicesSectionUseCase,
    private readonly updateHomeServicesSectionUseCase: UpdateHomeServicesSectionUseCase,
    private readonly deleteHomeServicesSectionUseCase: DeleteHomeServicesSectionUseCase,
  ) {}

  // Endpoint to retrieve the home Services section
  @Public() // Marking this endpoint as public, allowing access without JWT authentication
  @Get(':homeServicesId')
  find() {

    return this.findHomeServicesSectionsUseCase.execute();
  }

  // Endpoint to create a new home Services section
  @Post()
  create(
    @Body() createHomeServicesSectionDto: CreateHomeServicesSectionDto,
    @Actor() actor: ActorType,
  ) {

    return this.createHomeServicesSectionUseCase.execute(createHomeServicesSectionDto, actor);
  }

  // Endpoint to update the existing home Services section by its ID
  @Put(':homeServicesId')
  update(
    @Param('homeServicesId') homeServicesId: string,
    @Body() updateHomeServicesSectionDto: UpdateHomeServicesSectionDto,
    @Actor() actor: ActorType,
  ) {

    // + operator to convert string to number
    return this.updateHomeServicesSectionUseCase.execute(+homeServicesId, updateHomeServicesSectionDto, actor);
  }

  // Endpoint to delete the home Services section by its ID
  @Delete(':homeServicesId')
  remove(
    @Param('homeServicesId') homeServicesId: string,
    @Actor() actor: ActorType,
  ) {
    
    // + operator to convert string to number
    return this.deleteHomeServicesSectionUseCase.execute(+homeServicesId, actor);
  }
}