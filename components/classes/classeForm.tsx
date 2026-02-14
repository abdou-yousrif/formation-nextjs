// components/ÉlèveForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Classe, addClasse, updateClasse, getClasses } from "@/lib/supabase/classes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Props {
    classe?: Classe | null;          // si édition, on passe la classe existante
  onClose: () => void;
  onSuccess: () => void;
}

export default function ClasseForm({ classe, onClose, onSuccess }: Props) {
  const isEdit = !!classe;

  const [formData, setFormData] = useState({
    name: classe?.name || "",
    level: classe?.level || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

    const [classes, setClasses] = useState<Classe[]>([]);
  
    const itemsPerPage = 10;
  

  useEffect(() => {
    // Focus sur le premier input au montage
    document.getElementById("name")?.focus();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nom de la classe requis";
    if (!formData.level.trim()) newErrors.level = "Niveau requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Map formData to match Classe fields and include created_at
    const mappedData = {
      name: formData.name,
      level: formData.level
    };

    if (isEdit && classe?.id) {
      await updateClasse(classe.id, mappedData);
    } else {
      await addClasse(mappedData);
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
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="level">Niveau</Label>
                <Input
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className={errors.level ? "border-red-500" : ""}
                />
                {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
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