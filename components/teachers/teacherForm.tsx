// components/ÉlèveForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Teacher, addTeacher, updateTeacher, getTeachers } from "@/lib/supabase/teachers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Props {
    teacher?: Teacher | null;          // si édition, on passe l'enseignant existant
  onClose: () => void;
  onSuccess: () => void;
}

export default function TeacherForm({ teacher, onClose, onSuccess }: Props) {
  const isEdit = !!teacher;

  const [formData, setFormData] = useState({
    first_name: teacher?.first_name || "",
    last_name: teacher?.last_name || "",
    email: teacher?.email || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

    const [teachers, setTeachers] = useState<Teacher[]>([]);
  
    const itemsPerPage = 10;
  

  useEffect(() => {
    // Focus sur le premier input au montage
    document.getElementById("first_name")?.focus();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.first_name.trim()) newErrors.first_name = "Prénom requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Nom requis";
    if (!formData.email.trim()) newErrors.email = "Email requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Map formData to match Teacher fields and include created_at
    const mappedData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email
    };

    if (isEdit && teacher?.id) {
      await updateTeacher(teacher.id, mappedData);
    } else {
      await addTeacher(mappedData);
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
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className={errors.first_name ? "border-red-500" : ""}
                />
                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
              </div>

              <div>
                <Label htmlFor="last_name">Prénom</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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