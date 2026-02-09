import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

// DTO for updating an about section
export class UpdateAboutSectionDto {

    // Section field is optional but must be a string if provided
    @IsString({ message: 'Seção deve ser um texto válido.'})
    @IsOptional()
    section?: string;

    // Context text is optional but must be a string if provided
    @IsString({ message: 'Texto do conteúdo deve ser um texto válido.'})
    @IsOptional()
    contentText?: string;
}