import { IsString, IsNotEmpty } from 'class-validator';

// DTO for creating an about section
export class CreateAboutSectionDto {

  // Section field must be a non-empty string
  @IsString({ message: 'Seção deve ser um texto válido.'})
  @IsNotEmpty({ message: 'Seção não pode estar vazia.'})
  section: string;

  // Context text must be a non-empty string
  @IsString({ message: 'Texto do conteúdo deve ser um texto válido.'})
  @IsNotEmpty({ message: 'Texto do conteúdo não pode estar vazio.'})
  contentText: string;
}