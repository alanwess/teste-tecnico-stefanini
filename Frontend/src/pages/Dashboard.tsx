import { UserList } from '@/components/UserList';
import { UserForm } from '@/components/UserForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de usuários</h1>
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Criar usuário</h2>
          <UserForm />
        </div>

        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Lista de usuários</h2>
          <UserList />
        </div>
      </div>
    </div>
  );
}