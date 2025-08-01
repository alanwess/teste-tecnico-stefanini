import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  const mockAuthService = {
    login: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should call authService.login and return token', async () => {
      const dto: AuthDto = {
        email: 'alan@email.com',
        password: 'secret',
      }

      const expectedResult = {
        access_token: 'fake-jwt-token',
      }

      jest.spyOn(authService, 'login').mockResolvedValueOnce(expectedResult)

      const result = await controller.login(dto)

      expect(authService.login).toHaveBeenCalledWith(dto)
      expect(result).toEqual(expectedResult)
    })
  })
})
