import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'; 

// Defining the HomeServicesEntity class to represent the Home page "Services" section in the database
@Entity('home_services')
export class HomeServicesEntity {

  // Id column as primary key
  @PrimaryGeneratedColumn({ name: 'home_services_id', type: 'int' })
  homeServicesId: number;

  // Content text column of varchar type with length of 700 characters and not nullable
  @Column({ name: 'home_services_content_text', type: 'varchar', length: 700, nullable: false })
  homeServicesContentText: string;

  // Timestamps for record creation and last update
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}