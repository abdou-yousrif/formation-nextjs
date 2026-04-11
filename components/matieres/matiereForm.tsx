// components/ÉlèveForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Matiere, addMatiere, updateMatiere, getMatieres } from "@/lib/supabase/matieres";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Classe, getClasses } from "@/lib/supabase/classes";
import { Teacher, getTeachers } from "@/lib/supabase/teachers";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Props {
    matiere?: Matiere | null;          // si édition, on passe l'enseignant existant
  onClose: () => void;
  onSuccess: () => void;
}

export default function MatiereForm({ matiere, onClose, onSuccess }: Props) {
  const isEdit = !!matiere;

  const [formData, setFormData] = useState({
    name: matiere?.name || "",
    code: matiere?.code || "",
    coefficient: matiere?.coefficient || "",
    class_id: matiere?.class_id || "",
    teacher_id: matiere?.teacher_id || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

    const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
    const itemsPerPage = 10;

  // charger les classes au montage
  const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Erreur lors du chargement des classes :", error);
      }
  };

  const fetchTeachers = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch (error) {
        console.error("Erreur lors du chargement des professeurs :", error);
      }
  };
  

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    // Focus sur le premier input au montage
    document.getElementById("name")?.focus();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Libelle requise";
    if (!formData.code?.trim()) newErrors.code = "Code requis";
    if (!formData.coefficient || isNaN(Number(formData.coefficient))) newErrors.coefficient = "Coefficient requis";
    if (!formData.class_id) newErrors.class = "Classe requise";
    if (!formData.teacher_id) newErrors.teacher = "Enseignant requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Map formData to match Matiere fields and include created_at
    const mappedData = {
      name: formData.name,
      code: formData.code,
      coefficient: Number(formData.coefficient),
      class_id: Number(formData.class_id),
      teacher_id: Number(formData.teacher_id),
      created_at: matiere?.created_at || new Date().toISOString(),
    };

    if (isEdit && matiere?.id) {
      await updateMatiere(matiere.id, mappedData);
    } else {
      await addMatiere(mappedData);
    }
    onSuccess();
    onClose();
  }; */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const mappedData = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      coefficient: Number(formData.coefficient),
      class_id: Number(formData.class_id),
      teacher_id: Number(formData.teacher_id),
      // Pas besoin de created_at en update (Supabase gère updated_at)
      ...( !isEdit && { created_at: new Date().toISOString() } )
    };

    try {
      if (isEdit && matiere?.id) {
        await updateMatiere(matiere.id, mappedData);
      } else {
        await addMatiere(mappedData as Omit<Matiere, 'id'>);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de la sauvegarde :", err);
      alert(`Erreur : ${err.message || err}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-background backdrop-blur bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {isEdit ? "Modifier une matiere" : "Ajouter une matiere"}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Libelle</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className={errors.code ? "border-red-500" : ""}
                />
                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
              </div>
              <div>
                <Label htmlFor="coefficient">Coefficient</Label>
                <Input
                  id="coefficient"
                  value={formData.coefficient}
                  onChange={(e) => setFormData({ ...formData, coefficient: e.target.value })}
                  className={errors.coefficient ? "border-red-500" : ""}
                />
                {errors.coefficient && <p className="text-red-500 text-xs mt-1">{errors.coefficient}</p>}
              </div>
              <div>
                <Label htmlFor="class_id">Classe</Label>
                <Select
                  value={formData.class_id?.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, class_id: Number(value) })
                  }
                >
                  <SelectTrigger className={errors.class ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionnez une classe" />
                  </SelectTrigger>

                  <SelectContent>
                    {classes.map((classe) => (
                      <SelectItem key={classe.id} value={classe.id.toString()}>
                        {classe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.class && (
                  <p className="text-red-500 text-xs mt-1">{errors.class}</p>
                )}
              </div>
              <div>
                <Label htmlFor="teacher_id">Professeur</Label>
                <Select
                  value={formData.teacher_id?.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, teacher_id: Number(value) })
                  }
                >
                  <SelectTrigger className={errors.teacher ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionnez un professeur" />
                  </SelectTrigger> 

                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.last_name} {teacher.first_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.teacher && (
                  <p className="text-red-500 text-xs mt-1">{errors.teacher}</p>
                )}
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