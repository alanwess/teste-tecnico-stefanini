import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
    @ApiProperty({ example: 'stefanini@email.com' })
    @IsEmail()
    readonly email: string;

    @ApiProperty({ example: 'admin456' })
    @IsString()
    @MinLength(6)
    readonly password: string;
}