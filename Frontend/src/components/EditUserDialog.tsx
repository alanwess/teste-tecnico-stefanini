import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { toast } from "sonner";
import api from "../services/api";
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

interface EditUserDialogProps {
  user: User;
  onUpdate: () => void;
}

export function EditUserDialog({ user }: EditUserDialogProps) {
  const { updateUser } = useUserContext();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    cpf: user.cpf,
    birthDate: user.birthDate.split('T')[0],
    gender: user.gender,
    naturalness: user.naturalness,
    nationality: user.nationality,
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(user.id, formData);
      toast("Usuário atualizado", { description: "Usuário atualizado com sucesso!" });
      setOpen(false);
    } catch (error: any) {
      toast("Falha ao atualizar o usuário", {
        description: error.response?.data?.message || "Falha ao atualizar o usuário"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            required
            type="text"
            placeholder="Nome"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input
            required
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <Input 
            required
            type="text"
            placeholder="CPF (000.000.000-00)"
            value={formData.cpf}
            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
          />
          <Input 
            required
            type="date"
            placeholder="Data de nascimento"
            value={formData.birthDate}
            onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
          />
          <Select
            value={formData.gender}
            onValueChange={(value) => setFormData({...formData, gender: value})}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Gênero</SelectLabel>
                <SelectItem value="male">Masculino</SelectItem>
                <SelectItem value="female">Feminino</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            required
            type="text"
            placeholder="Naturalidade"
            value={formData.naturalness}
            onChange={(e) => setFormData({...formData, naturalness: e.target.value})}
          />
          <Input
            required 
            type="text"
            placeholder="Nacionalidade"
            value={formData.nationality}
            onChange={(e) => setFormData({...formData, nationality: e.target.value})}
          />
          <Button type="submit" className="w-full">Atualizar usuario</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}