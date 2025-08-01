import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { UserProvider, useUserContext } from './UserContext';
import api from '@/services/api';

jest.mock('@/services/api');

const mockUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  cpf: '123.456.789-00',
  birthDate: '1990-01-01',
  gender: 'M',
  naturalness: 'SP',
  nationality: 'Brasileira',
};

function TestComponent() {
  const { users, refreshUsers, addUser, updateUser, deleteUser } = useUserContext();

  React.useEffect(() => {
    refreshUsers();
  }, []);

  return (
    <div>
      <span data-testid="user-count">{users.length}</span>
      <button onClick={() => addUser({ ...mockUser })}>Add</button>
      <button onClick={() => updateUser(1, { name: 'Jane' })}>Update</button>
      <button onClick={() => deleteUser(1)}>Delete</button>
    </div>
  );
}

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and set users on refresh', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [mockUser] });

    const { getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => expect(getByTestId('user-count').textContent).toBe('1'));
    expect(api.get).toHaveBeenCalledWith('/users');
  });

  it('should add a user and refresh list', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [mockUser] });
    (api.post as jest.Mock).mockResolvedValue({});

    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => getByText('Add').click());
    expect(api.post).toHaveBeenCalledWith('/users', expect.objectContaining({ name: 'John Doe' }));
    expect(api.get).toHaveBeenCalledTimes(2); // one on load, one after add
  });

  it('should update a user and refresh list', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [mockUser] });
    (api.patch as jest.Mock).mockResolvedValue({});

    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => getByText('Update').click());
    expect(api.patch).toHaveBeenCalledWith('/users/1', { name: 'Jane' });
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should delete a user and refresh list', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: [mockUser] });
    (api.delete as jest.Mock).mockResolvedValue({});

    const { getByText } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await waitFor(() => getByText('Delete').click());
    expect(api.delete).toHaveBeenCalledWith('/users/1');
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
