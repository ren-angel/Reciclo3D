import { IsString, IsNotEmpty } from 'class-validator';

// DTO for creating an about section
export class CreateHomeAboutSectionDto {

  // Home context text must be a non-empty string
  @IsString({ message: 'Texto do conteúdo deve ser um texto válido.'})
  @IsNotEmpty({ message: 'Texto do conteúdo não pode estar vazio.'})
  homeAboutContentText: string;
}