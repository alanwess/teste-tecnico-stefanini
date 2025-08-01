import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import mockUsers from './mock/mockAdmins'
import { AuthDto } from './dto/auth.dto'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let jwtService: JwtService

  const mockJwtService = {
    sign: jest.fn(),
  }

  const mockUsersService = {} // não é usado nesse AuthService, mas incluído para manter a assinatura

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jwtService = module.get<JwtService>(JwtService)
  })

  describe('validateUser', () => {
    it('deve retornar o usuário se encontrado', async () => {
      const user = mockUsers[0]
      const result = await service.validateUser(user.id)
      expect(result).toEqual(user)
    })

    it('deve lançar UnauthorizedException se usuário não encontrado', async () => {
      await expect(service.validateUser('invalid-id')).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('login', () => {
    it('deve retornar access_token se credenciais forem válidas', async () => {
      const user = mockUsers[0]
      const authDto: AuthDto = {
        email: user.email,
        password: 'senha123',
      }

      // simular o retorno do bcrypt.compare
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      mockJwtService.sign = jest.fn().mockReturnValue('token-jwt-fake')

      const result = await service.login(authDto)

      expect(bcrypt.compare).toHaveBeenCalledWith(authDto.password, user.password)
      expect(result).toEqual({ access_token: 'token-jwt-fake' })
    })

    it('deve lançar UnauthorizedException se email for inválido', async () => {
      const authDto: AuthDto = {
        email: 'naoexiste@email.com',
        password: 'qualquer',
      }

      await expect(service.login(authDto)).rejects.toThrow(UnauthorizedException)
    })

    it('deve lançar UnauthorizedException se senha for inválida', async () => {
      const user = mockUsers[0]
      const authDto: AuthDto = {
        email: user.email,
        password: 'senhaErrada',
      }

      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(service.login(authDto)).rejects.toThrow(UnauthorizedException)
    })
  })
})
