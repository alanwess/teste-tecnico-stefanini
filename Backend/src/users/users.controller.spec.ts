import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  const mockUser: UserEntity = {
    id: 1,
    name: 'Alan Wesley',
    email: 'alan@email.com',
    cpf: '12345678900',
    birthDate: new Date('1990-01-01'),
    gender: 'MALE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated' }),
    remove: jest.fn().mockResolvedValue(undefined),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      name: 'Alan Wesley',
      email: 'alan@email.com',
      cpf: '12345678900',
      birthDate: new Date('1990-01-01').toString(),
      gender: 'MALE',
    }
    expect(await controller.create(dto)).toEqual(mockUser)
    expect(service.create).toHaveBeenCalledWith(dto)
  })

  it('should return all users', async () => {
    expect(await controller.findAll()).toEqual([mockUser])
    expect(service.findAll).toHaveBeenCalled()
  })

  it('should return a user by ID', async () => {
    expect(await controller.findOne('1')).toEqual(mockUser)
    expect(service.findOne).toHaveBeenCalledWith(1)
  })

  it('should update a user', async () => {
    const dto: UpdateUserDto = { name: 'Updated' }
    expect(await controller.update('1', dto)).toEqual({ ...mockUser, name: 'Updated' })
    expect(service.update).toHaveBeenCalledWith(1, dto)
  })

  it('should delete a user', async () => {
    expect(await controller.remove('1')).toBeUndefined()
    expect(service.remove).toHaveBeenCalledWith(1)
  })
})