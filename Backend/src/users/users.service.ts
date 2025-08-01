import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { isValidCPF, isValidDate } from './utils/validation.utils';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        if (!isValidCPF(createUserDto.cpf)) {
            throw new BadRequestException('CPF Inválido');
        }

        if (!isValidDate(createUserDto.birthDate)) {
            throw new BadRequestException('Data de nascimento inválida');
        }

        await this.findByCpf(createUserDto.cpf);

        const user = this.usersRepository.create(createUserDto);
        return await this.usersRepository.save(user);
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.usersRepository.find();
    }

    async findOne(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`Usuário #${id} não encontrado`);
        }
        return user;
    }

    async findByEmail(email: string, registry: boolean): Promise<UserEntity | null> {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user && !registry) {
            throw new NotFoundException(`Usuário com email ${email} não encontrado`);
        }
        return user;
    }

    async findByCpf(cpf: string): Promise<UserEntity | null> {
        const user = await this.usersRepository.findOne({ where: { cpf } });
        if (user) {
            throw new BadRequestException(`Usuário com CPF ${cpf} já existe`);
        }
        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.findOne(id);
        
        if (updateUserDto.cpf && !isValidCPF(updateUserDto.cpf)) {
            throw new BadRequestException('CPF inválido');
        }

        if (updateUserDto.birthDate && !isValidDate(updateUserDto.birthDate)) {
            throw new BadRequestException('Data de nascimento inválida');
        }
        
        Object.assign(user, updateUserDto);
        return await this.usersRepository.save(user);
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
}