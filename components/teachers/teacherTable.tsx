// components/StudentTable.tsx
import { Teacher } from "@/lib/supabase/teachers";
import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react"; // ou tes icônes

interface Props {
  teachers: Teacher[];
  onEdit: (teacher: Teacher) => void;
  onDelete: (id: number) => void;
}

export default function ClasseTable({ teachers, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm text-left">
        <thead className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
          <tr>
            <th className="p-4">Nom</th>
            <th className="p-4">Prénom</th>
            <th className="p-4">Email</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{teacher.first_name}</td>
              <td className="p-4">{teacher.last_name}</td>
              <td className="p-4">{teacher.email}</td>
              <td className="p-4 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(teacher)}>
                  <IconPencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(teacher.id)}>
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