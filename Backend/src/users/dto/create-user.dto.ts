import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'Alan', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty({ message: 'O Nome é obrigatório' })
    readonly name: string;

    @ApiPropertyOptional({ example: 'Masculino', description: 'Gender of user' })
    @IsOptional()
    @IsString()
    readonly gender?: string;

    @ApiPropertyOptional({ example: 'alan@email.com', description: 'Email address of the user' })
    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @ApiProperty({ example: '1995-01-30', description: 'Birth date of the user' })
    @IsString()
    @IsNotEmpty({ message: 'A Data de nascimento é obrigatória' })
    readonly birthDate: string;

    @ApiPropertyOptional({ example: 'São Paulo', description: 'City where the user resides' })
    @IsString()
    @IsOptional()
    readonly naturalness?: string;

    @ApiPropertyOptional({ example: 'Brasileiro', description: 'Country where the user born' })
    @IsString()
    @IsOptional()
    readonly nationality?: string;

    @ApiProperty({ example: '123.456.789-00', description: 'CPF of the user' })
    @IsString()
    @IsNotEmpty({ message: 'O CPF é obrigatório' })
    @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
        message: 'CPF deve estar em formato XXX.XXX.XXX-XX'
    })
    readonly cpf: string;
}