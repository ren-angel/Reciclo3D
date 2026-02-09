import { Expose } from "class-transformer";

// DTO for reading about section data
export class AboutDto {

  // Expose decorator to include these fields when transforming the entity to this DTO
  @Expose()
  aboutId: string;

  @Expose()
  section: string;
  
  @Expose()
  contentText: string;
}