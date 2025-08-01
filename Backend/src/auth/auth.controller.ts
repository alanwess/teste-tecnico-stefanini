import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'User login', description: 'Authenticate user and return JWT token' })
    @ApiResponse({ status: 200, description: 'Returns JWT token' })
    async login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto);
    }
}