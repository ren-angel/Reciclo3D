import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'; 

// Defining the HomeAboutEntity class to represent the Home page "About" section in the database
@Entity('home_about')
export class HomeAboutEntity {

  // Id column as primary key
  @PrimaryGeneratedColumn({ name: 'about_id', type: 'int' })
  homeAboutId: number;

  // Content text column of varchar type with length of 700 characters and not nullable
  @Column({ name: 'home_about_content_text', type: 'varchar', length: 700, nullable: false })
  homeAboutContentText: string;

  // Timestamps for record creation and last update
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}