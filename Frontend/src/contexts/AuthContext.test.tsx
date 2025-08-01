import { render, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import api from '../services/api'

jest.mock('../services/api')

const mockedApi = api as jest.Mocked<typeof api>

const TestComponent = () => {
  const { isAuthenticated, token, login, logout, register } = useAuth()

  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'LoggedIn' : 'LoggedOut'}</div>
      <div data-testid="token">{token}</div>
      <button onClick={() => login('test@example.com', '123456')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() =>
        register(
          'John Doe',
          'john@example.com',
          'password123',
          'Brazilian',
          'São Paulo',
          '12345678900',
          'M',
          '01/01/1990'
        )
      }>Register</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should login and store token', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: { access_token: 'fake-token' } })

    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await act(async () => {
      getByText('Login').click()
    })

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: '123456',
    })
    expect(localStorage.getItem('token')).toBe('fake-token')
    expect(getByTestId('auth-status').textContent).toBe('LoggedIn')
    expect(getByTestId('token').textContent).toBe('fake-token')
  })

  it('should logout and clear token', async () => {
    localStorage.setItem('token', 'existing-token')

    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await act(() => {
      getByText('Logout').click()
    })

    expect(localStorage.getItem('token')).toBeNull()
    expect(getByTestId('auth-status').textContent).toBe('LoggedOut')
    expect(getByTestId('token').textContent).toBe('')
  })

  it('should register and store token', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: { access_token: 'register-token' } })

    const { getByText, getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await act(async () => {
      getByText('Register').click()
    })

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', expect.objectContaining({
      name: 'John Doe',
      email: 'john@example.com',
      cpf: '12345678900',
    }))

    expect(localStorage.getItem('token')).toBe('register-token')
    expect(getByTestId('auth-status').textContent).toBe('LoggedIn')
    expect(getByTestId('token').textContent).toBe('register-token')
  })

  it('should be logged out if no token in localStorage', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(getByTestId('auth-status').textContent).toBe('LoggedOut')
  })
})
