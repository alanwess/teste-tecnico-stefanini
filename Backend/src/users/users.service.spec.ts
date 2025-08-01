import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

// mocks dos utilitários
jest.mock('./utils/validation.utils', () => ({
  isValidCPF: jest.fn(() => true),
  isValidDate: jest.fn(() => true),
}))

describe('UsersService', () => {
  let service: UsersService
  let repo: jest.Mocked<Repository<UserEntity>>

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

  const createDto: CreateUserDto = {
    name: 'Alan Wesley',
    email: 'alan@email.com',
    cpf: '12345678900',
    birthDate: new Date('1990-01-01').toString(),
    gender: 'MALE',
  }

  const updateDto: UpdateUserDto = {
    name: 'Updated Name',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn().mockReturnValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    repo = module.get(getRepositoryToken(UserEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create and return a user', async () => {
      repo.findOne.mockResolvedValueOnce(null) // CPF não existe
      expect(await service.create(createDto)).toEqual(mockUser)
      expect(repo.create).toHaveBeenCalledWith(createDto)
      expect(repo.save).toHaveBeenCalled()
    })

    it('should throw if CPF já existe', async () => {
      repo.findOne.mockResolvedValueOnce(mockUser) // CPF já existe
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException)
    })
  })

  describe('findAll', () => {
    it('should return all users', async () => {
      expect(await service.findAll()).toEqual([mockUser])
      expect(repo.find).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return user by ID', async () => {
      expect(await service.findOne(1)).toEqual(mockUser)
    })

    it('should throw if user not found', async () => {
      repo.findOne.mockResolvedValueOnce(null)
      await expect(service.findOne(2)).rejects.toThrow(NotFoundException)
    })
  })

  describe('findByEmail', () => {
    it('should return user if found', async () => {
      expect(await service.findByEmail('alan@email.com', true)).toEqual(mockUser)
    })

    it('should throw if not found and registry=false', async () => {
      repo.findOne.mockResolvedValueOnce(null)
      await expect(service.findByEmail('not@found.com', false)).rejects.toThrow(NotFoundException)
    })
  })

  describe('findByCpf', () => {
    it('should return null if not found (ok para cadastro)', async () => {
      repo.findOne.mockResolvedValueOnce(null)
      expect(await service.findByCpf('000')).toBeNull()
    })

    it('should throw if user with CPF exists', async () => {
      repo.findOne.mockResolvedValueOnce(mockUser)
      await expect(service.findByCpf('123')).rejects.toThrow(BadRequestException)
    })
  })

  describe('update', () => {
    it('should update and return user', async () => {
      repo.findOne.mockResolvedValueOnce(mockUser)
      expect(await service.update(1, updateDto)).toEqual(mockUser)
      expect(repo.save).toHaveBeenCalled()
    })
  })

  describe('remove', () => {
    it('should remove user', async () => {
      repo.findOne.mockResolvedValueOnce(mockUser)
      await expect(service.remove(1)).resolves.toBeUndefined()
      expect(repo.remove).toHaveBeenCalledWith(mockUser)
    })
  })
})
