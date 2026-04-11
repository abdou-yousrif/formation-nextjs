// components/StudentTable.tsx
import { Eleve } from "@/lib/supabase/eleves";
import { Button } from "./ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react"; // ou tes icônes

interface Props {
  eleves: Eleve[];
  onEdit: (eleve: Eleve) => void;
  onDelete: (id: number) => void;
}

export default function EleveTable({ eleves, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm text-left">
        <thead className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
          <tr>
            <th className="p-4">Nom complet</th>
            <th className="p-4">Âge</th>
            <th className="p-4">Classe</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {eleves.map((eleve) => (
            <tr key={eleve.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{eleve.first_name} {eleve.last_name}</td>
              <td className="p-4">{eleve.age}</td>
              <td className="p-4">{eleve.classes?.name || "Classe inconnue"}</td>
              <td className="p-4 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(eleve)}>
                  <IconPencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(eleve.id)}>
                  <IconTrash className="h-4 w-4 text-red-600" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}