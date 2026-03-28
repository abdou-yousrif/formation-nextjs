// components/ÉlèveForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Evaluation, addEvaluation, getEvaluations, updateEvaluation } from "@/lib/supabase/evaluations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Eleve, getEleves } from "@/lib/supabase/eleves";
import { Matiere, getMatieres } from "@/lib/supabase/matieres";
import { Teacher, getTeachers } from "@/lib/supabase/teachers";

interface Props {
    evaluation?: Evaluation | null;
  onClose: () => void;
  onSuccess: () => void;
}


export default function EvaluationForm({ evaluation, onClose, onSuccess }: Props) {
  const isEdit = !!evaluation;

  const [formData, setFormData] = useState({
    eleve_id: evaluation?.eleve_id || "",
    matiere_id: evaluation?.matiere_id || "",
    teacher_id: evaluation?.teacher_id || "",
    type: evaluation?.type || "",
    note: evaluation?.note || "",
    commentaire: evaluation?.commentaire || "",
    date: evaluation?.date,
  });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [eleves, setEleves] = useState<Eleve[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [matieres, setMatieres] = useState<Matiere[]>([]);
  
    const itemsPerPage = 5;
  
   // charger les éleves au montage
    const fetchEleves = async () => {
        try {
            const data = await getEleves();
            setEleves(data);
        } catch (error) {
            console.error("Erreur lors du chargement des élèves :", error);
        }
    };
    const fetchTeachers = async () => {
        try {
            const data = await getTeachers();
            setTeachers(data);
        } catch (error) {
            console.error("Erreur lors du chargement des profs :", error);
        }
    };
    const fetchMatieres = async () => {
        try {
            const data = await getMatieres();
            setMatieres(data);
        } catch (error) {
            console.error("Erreur lors du chargement des matieres :", error);
        }
    };

    useEffect(() => {
        // Focus sur le premier input au montage
        document.getElementById("eleve_id")?.focus();
        fetchEleves();
        fetchTeachers();
        fetchMatieres();
    }, []);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.eleve_id.trim()) newErrors.eleve = "Eleve requis";
        if (!formData.matiere_id.trim()) newErrors.matiere = "Matiere requise";
        if (!formData.teacher_id.trim()) newErrors.teacher = "Prof requis";
        if (!formData.type.trim()) newErrors.type = "Type requis";
        if (!formData.note) newErrors.note = "Note requise";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Map formData to match Evaluation fields and include created_at
        const mappedData = {
        eleve_id: formData.eleve_id,
        matiere_id: formData.matiere_id,
        teacher_id: formData.teacher_id,
        type: formData.type,
        note: Number(formData.note),
        commentaire: formData.commentaire,
        date: formData.date ?? new Date().toISOString(),
        created_at: evaluation?.created_at || new Date().toISOString(),
        };

        if (isEdit && evaluation?.id) {
        await updateEvaluation(evaluation.id, mappedData);
        } else {
        await addEvaluation(mappedData);
        }
        onSuccess();
        onClose();
    };

  return (
    <div className="fixed inset-0 bg-background backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {isEdit ? "Modifier l'élève" : "Ajouter un élève"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="eleve_id">Elève</Label>
                    <select
                        id="eleve_id"
                        value={formData.eleve_id}
                        onChange={(e) => setFormData({ ...formData, eleve_id: e.target.value })}
                        className={errors.eleve ? "border-red-500" : ""}
                    >
                        <option value="">Sélectionnez un eleve</option>
                        {eleves.map((eleve) => (
                        <option key={eleve.id} value={eleve.id}>
                            {eleve.first_name} {eleve.last_name}
                        </option>
                        ))}
                    </select>
                    {errors.eleve && <p className="text-red-500 text-xs mt-1">{errors.eleve}</p>}
                </div>
                <div>
                    <Label htmlFor="matiere_id">Matiere</Label>
                    <select
                        id="matiere_id"
                        value={formData.matiere_id}
                        onChange={(e) => setFormData({ ...formData, matiere_id: e.target.value })}
                        className={errors.class ? "border-red-500" : ""}
                    >
                        <option value="">Sélectionnez une matiere</option>
                        {matieres.map((matiere) => (
                        <option key={matiere.id} value={matiere.id}>
                            {matiere.name}
                        </option>
                        ))}
                    </select>
                    {errors.matiere && <p className="text-red-500 text-xs mt-1">{errors.matiere}</p>}
                </div>
                <div>
                    <Label htmlFor="teacher_id">Prof</Label>
                    <select
                        id="teacher_id"
                        value={formData.teacher_id}
                        onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                        className={errors.class ? "border-red-500" : ""}
                    >
                        <option value="">Sélectionnez un prof</option>
                        {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                            {teacher.first_name} {teacher.last_name}
                        </option>
                        ))}
                    </select>
                    {errors.teacher && <p className="text-red-500 text-xs mt-1">{errors.teacher}</p>}
                </div>
                <div>
                    <Label htmlFor="type">Type de note</Label>
                    <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={errors.type ? "border-red-500" : ""}
                    />
                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                </div>

                <div>
                    <Label htmlFor="note">Note</Label>
                    <Input
                    id="note"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className={errors.note ? "border-red-500" : ""}
                    />
                    {errors.note && <p className="text-red-500 text-xs mt-1">{errors.note}</p>}
                </div>
                <div>
                    <Label htmlFor="commentaire">Commentaire</Label>
                    <Input
                        id="commentaire"
                        type="text"
                        value={formData.commentaire}
                        onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                    />
                </div>
                <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                        id="date"
                        type="text"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {isEdit ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}