import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {  
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { Button } from './ui/button';
import { toast } from "sonner";
import { EditUserDialog } from './EditUserDialog';
import { UserGender } from '@/enums/gender.user.enum';
import { useUserContext } from "@/contexts/UserContext";

interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  gender: string;
  naturalness: string;
  nationality: string;
}

export function UserList() {
  const { users, getAllUsers, deleteUser } = useUserContext();
  const [localUsers, setLocalUsers] = useState<User[]>([]);

  const genders = (value: string) => {
    switch (value) {
      case 'male':
        return UserGender.MALE
      case 'female':
        return UserGender.FEMALE
      case 'other':
        return UserGender.OTHER
      default:
        return 'Indefinido';
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este usuário?')) {
      try {
        await deleteUser(id);
        toast("Usuário excluído", { description: "Usuário excluído com sucesso!" });
      } catch (error) {
        toast("Exclusão falhou", {
          description: "Falha ao excluir o usuário!"
        });
      }
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Usuários existentes</CardTitle>
        <CardDescription className="text-center">Gerencie os usuários existentes na base de dados</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Data de nascimento</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>Naturalidade</TableHead>
              <TableHead>Nacionalidade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.cpf}</TableCell>
                <TableCell>{new Date(user.birthDate).toLocaleDateString()}</TableCell>
                <TableCell>{genders(user.gender)}</TableCell>
                <TableCell>{user.naturalness}</TableCell>
                <TableCell>{user.nationality}</TableCell>
                <TableCell className="space-x-2">
                  <EditUserDialog user={user} onUpdate={() => {}} />
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Deletar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {localUsers.length === 0 && (
              <div className="w-full">
                <h1 className="text-md mt-2 mx-auto">Adicione usuários para visualizar os dados</h1>
              </div>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}