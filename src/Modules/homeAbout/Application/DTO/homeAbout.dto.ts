import { Expose } from "class-transformer";

// DTO for reading home "about" section data
export class HomeAboutDto {

  // Expose decorator to include these fields when transforming the entity to this DTO
  @Expose()
  homeAboutId: string;

  @Expose()
  homeContentText: string;
}