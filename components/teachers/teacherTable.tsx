// components/StudentTable.tsx
import { Classe } from "@/lib/supabase/classes";
import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react"; // ou tes icônes

interface Props {
  classes: Classe[];
  onEdit: (classe: Classe) => void;
  onDelete: (id: string) => void;
}

export default function ClasseTable({ classes, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm text-left">
        <thead className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
          <tr>
            <th className="p-4">Labelle</th>
            <th className="p-4">Level</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classe) => (
            <tr key={classe.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{classe.name}</td>
              <td className="p-4">{classe.level}</td>
              <td className="p-4 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(classe)}>
                  <IconPencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(classe.id)}>
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