import { IsString, IsOptional } from 'class-validator';

// DTO for updating an about section
export class UpdateHomeAboutSectionDto {

    // Context text is optional but must be a string if provided
    @IsString({ message: 'Texto do conteúdo deve ser um texto válido.'})
    @IsOptional()
    homeContentText?: string;
}