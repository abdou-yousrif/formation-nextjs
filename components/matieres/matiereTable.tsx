// components/StudentTable.tsx
import { Matiere } from "@/lib/supabase/matieres";
import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react"; // ou tes icônes

interface Props {
    matieres: Matiere[];
    onEdit: (matiere: Matiere) => void;
    onDelete: (id: number) => void;
}

export default function ClasseTable({ matieres, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm text-left">
        <thead className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
          <tr>
            <th className="p-4">Libelle</th>
            <th className="p-4">Code</th>
            <th className="p-4">Coefficient</th>
            <th className="p-4">Classe</th>
            <th className="p-4">Professeur</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {matieres.map((matiere) => (
            <tr key={matiere.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{matiere.name}</td>
              <td className="p-4">{matiere.code}</td>
              <td className="p-4">{matiere.coefficient}</td>
              <td className="p-4">{matiere.classes?.name}</td>
              <td className="p-4">{matiere.teachers?.last_name} {matiere.teachers?.first_name}</td>
              <td className="p-4 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(matiere)}>
                  <IconPencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(matiere.id)}>
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