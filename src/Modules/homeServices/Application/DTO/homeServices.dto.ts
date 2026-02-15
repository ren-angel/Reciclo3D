import { Expose } from "class-transformer";

// DTO for reading home "Services" section data
export class HomeServicesDto {

  // Expose decorator to include these fields when transforming the entity to this DTO
  @Expose()
  homeServicesId: string;

  @Expose()
  homeServicesContentText: string;
}