// components/StudentTable.tsx
import { Evaluation } from "@/lib/supabase/evaluations";
import { Button } from "@/components/ui/button";
import { IconPencil, IconTrash } from "@tabler/icons-react"; // ou tes icônes

interface Props {
  evaluations: Evaluation[];
  onEdit: (evaluation: Evaluation) => void;
  onDelete: (id: string) => void;
}

export default function EvaluationTable({ evaluations, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm text-left">
        <thead className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear">
          <tr>
            <th className="p-4">Elève</th>
            <th className="p-4">Matiere</th>
            <th className="p-4">Prof</th>
            <th className="p-4">Type de note</th>
            <th className="p-4">Note</th>
            <th className="p-4">Commentaire</th>
            <th className="p-4">Date</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation) => (
            <tr key={evaluation.id} className="border-t hover:bg-gray-50">
              <td className="p-4">{evaluation.eleves?.first_name} {evaluation.eleves?.last_name}</td>
              <td className="p-4">{evaluation.teachers?.first_name} {evaluation.teachers?.last_name}</td>
              <td className="p-4">{evaluation.matieres?.name}</td>
              <td className="p-4">{evaluation.type}</td>
              <td className="p-4">{evaluation.note}</td>
              <td className="p-4">{evaluation.commentaire}</td>
              <td className="p-4">{evaluation.date}</td>
              <td className="p-4 text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(evaluation)}>
                  <IconPencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(evaluation.id)}>
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