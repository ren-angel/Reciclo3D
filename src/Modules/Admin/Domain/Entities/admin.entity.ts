import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

// ATTENTION: Turn ON verification code again by making it non-nullable here and on database, and then apply it to the jwt and admin logins parts of this code

// Defining the AdminEntity class to represent the "admin" section in the database
@Entity('admin')
export class AdminEntity {

  // Id column as primary key
  @PrimaryGeneratedColumn({ name: 'admin_id', type: 'int' })
  adminId: number;

  // E-mail column of varchar type with character limit of 255 and not nullable
  @Column({ name: 'admin_email', type: 'varchar', length: 255, nullable: false })
  adminEmail: string;

  // Password column of varchar type with character limit of 255 and not nullable
  @Column({ name: 'admin_password', type: 'varchar', length: 255, nullable: false })
  adminPassword: string;
  
  // Verification code column of char type with character limit of 6
  @Column({ name: 'verification_code', type: 'char', length: 6, nullable: true })
  adminVerificationCode: string;
}