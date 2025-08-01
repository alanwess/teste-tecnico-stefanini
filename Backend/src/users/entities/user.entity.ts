import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsDate, IsOptional, IsNotEmpty, Matches } from 'class-validator';

@Entity('users')
export class UserEntity {
    @ApiProperty({ description: 'User ID' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'User name' })
    @IsString()
    @IsNotEmpty()
    @Column()
    name: string;

    @ApiPropertyOptional({ description: 'User gender' })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    gender?: string;

    @ApiPropertyOptional({ description: 'User email' })
    @IsEmail()
    @IsOptional()
    @Column({ nullable: true })
    email?: string;

    @ApiProperty({ description: 'User birth date' })
    @IsDate()
    @IsNotEmpty()
    @Column()
    birthDate: Date;

    @ApiPropertyOptional({ description: 'User naturalness' })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    naturalness?: string;

    @ApiPropertyOptional({ description: 'User nationality' })
    @IsString()
    @IsOptional()
    @Column({ nullable: true })
    nationality?: string;

    @ApiProperty({ description: 'User CPF' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
        message: 'CPF deve estar em formato XXX.XXX.XXX-XX'
    })
    @Column({ unique: true })
    cpf: string;

    @ApiProperty({ description: 'Creation timestamp' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Last update timestamp' })
    @UpdateDateColumn()
    updatedAt: Date;
}