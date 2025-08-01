import { useState } from "react";
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
import { useUserContext } from "@/contexts/UserContext";

export function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    birthDate: '',
    gender: '',
    naturalness: '',
    nationality: '',
  });

  const { addUser } = useUserContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addUser(formData);
      toast("Usuário criado", { description: "Usuário criado com sucesso!" });
      // Reset form
      setFormData({
        name: '',
        email: '',
        cpf: '',
        birthDate: '',
        gender: '',
        naturalness: '',
        nationality: '',
      });
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast("Falha ao criar usuário",{
        description: error.response?.data?.message || "Falhou em criar usuário"
      });
    }
  };

  return (
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
      <Button type="submit" className="w-full">Criar usuário</Button>
    </form>
  );
}