import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import mockUsers from '../auth/mock/mockAdmins';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(id: string): Promise<any> {
        const user = mockUsers.find((user) => user.id === id);
        if (!user) {
            throw new UnauthorizedException('Usuário não encontrado');
        }
        return user;
    }

    async login(authDto: AuthDto) {
        const user = mockUsers.find((user) => user.email === authDto.email);
        
        if (!user || !(await bcrypt.compare(authDto.password, user.password))) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}