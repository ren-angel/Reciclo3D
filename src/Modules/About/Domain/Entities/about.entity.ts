import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'; 

// Defining the AboutEntity class to represent the "About" section in the database
@Entity('about')
export class AboutEntity {

  // Id column as primary key
  @PrimaryGeneratedColumn({ name: 'about_id', type: 'int' })
  aboutId: number;

  // Section title column of varchar type with character limit of 50 and not nullable
  @Column({ name: 'section', type: 'varchar', length: 50, nullable: false })
  section: string;
  // Content text column of text type and not nullable
  @Column({ name: 'content_text', type: 'text', nullable: false })
  contentText: string;

  // Timestamps for record creation and last update
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}