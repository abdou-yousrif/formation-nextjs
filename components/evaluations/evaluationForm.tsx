"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Evaluation, addEvaluation, updateEvaluation } from "@/lib/supabase/evaluations";
import { Eleve } from "@/lib/supabase/eleves";
import { Matiere } from "@/lib/supabase/matieres";
import { Teacher } from "@/lib/supabase/teachers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface Props {
  evaluation?: Evaluation | null;
  eleves: Eleve[];
  teachers: Teacher[];
  matieres: Matiere[];
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  eleve_id: string;
  matiere_id: string;
  teacher_id: string;
  type: "Devoir" | "Contrôle" | "Examen";
  note: string; // 👈 string côté form (important)
  date: string;
  commentaire?: string;
};

export default function EvaluationForm({
  evaluation,
  eleves,
  teachers,
  matieres,
  onClose,
  onSuccess,
}: Props) {
  const isEdit = !!evaluation;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    defaultValues: {
      eleve_id: evaluation?.eleve_id?.toString() || "",
      matiere_id: evaluation?.matiere_id?.toString() || "",
      teacher_id: evaluation?.teacher_id?.toString() || "",
      type: (evaluation?.type as any) || "Devoir",
      note: evaluation?.note?.toString() || "",
      date: evaluation?.date || new Date().toISOString().split("T")[0],
      commentaire: evaluation?.commentaire || "",
    },
  });

  // ✅ validation manuelle propre
  const validate = (data: FormData) => {
    let isValid = true;

    if (!data.eleve_id) {
      setError("eleve_id", { message: "Élève requis" });
      isValid = false;
    }

    if (!data.matiere_id) {
      setError("matiere_id", { message: "Matière requise" });
      isValid = false;
    }

    if (!data.teacher_id) {
      setError("teacher_id", { message: "Prof requis" });
      isValid = false;
    }

    if (!data.note) {
      setError("note", { message: "Note requise" });
      isValid = false;
    } else {
      const note = Number(data.note);
      if (isNaN(note) || note < 0 || note > 20) {
        setError("note", { message: "Note invalide (0-20)" });
        isValid = false;
      }
    }

    if (!data.date) {
      setError("date", { message: "Date requise" });
      isValid = false;
    }

    return isValid;
  };

  const onSubmit = async (data: FormData) => {
    if (!validate(data)) return;

    setLoading(true);

    try {
      const payload = {
        eleve_id: Number(data.eleve_id),
        matiere_id: Number(data.matiere_id),
        teacher_id: Number(data.teacher_id),
        type: data.type,
        note: Number(data.note),
        commentaire: data.commentaire,
        date: data.date,
      };

      if (isEdit && evaluation?.id) {
        await updateEvaluation(evaluation.id, payload);
      } else {
        await addEvaluation(payload);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            {isEdit ? "Modifier une évaluation" : "Nouvelle évaluation"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 👤 Contexte */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Élève</Label>
              <select {...register("eleve_id")} className="w-full border rounded p-2">
                <option value="">Choisir</option>
                {eleves.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.first_name} {e.last_name}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-xs">{errors.eleve_id?.message}</p>
            </div>

            <div>
              <Label>Matière</Label>
              <select {...register("matiere_id")} className="w-full border rounded p-2">
                <option value="">Choisir</option>
                {matieres.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-xs">{errors.matiere_id?.message}</p>
            </div>

            <div>
              <Label>Prof</Label>
              <select {...register("teacher_id")} className="w-full border rounded p-2">
                <option value="">Choisir</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.first_name} {t.last_name}
                  </option>
                ))}
              </select>
              <p className="text-red-500 text-xs">{errors.teacher_id?.message}</p>
            </div>
          </div>

          {/* 📝 Évaluation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <select {...register("type")} className="w-full border rounded p-2">
                <option value="Devoir">Devoir</option>
                <option value="Contrôle">Contrôle</option>
                <option value="Examen">Examen</option>
              </select>
            </div>

            <div>
              <Label>Note /20</Label>
              <Input type="number" {...register("note")} />
              <p className="text-red-500 text-xs">{errors.note?.message}</p>
            </div>
          </div>

          {/* 📅 Meta */}
          <div>
            <Label>Date</Label>
            <Input type="date" {...register("date")} />
            <p className="text-red-500 text-xs">{errors.date?.message}</p>
          </div>

          <div>
            <Label>Commentaire</Label>
            <Textarea {...register("commentaire")} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : isEdit ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}