import { IsString, IsOptional } from 'class-validator';

// DTO for updating an Services section
export class UpdateHomeServicesSectionDto {

    // Context text is optional but must be a string if provided
    @IsString({ message: 'Texto do conteúdo deve ser um texto válido.'})
    @IsOptional()
    homeServicesContentText?: string;
}