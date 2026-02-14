// components/ÉlèveForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Eleve, addEleve, getEleves, updateEleve } from "@/lib/supabase/eleves"; // adapte le chemin et le nom du fichier
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { X } from "lucide-react";
import { Classe, getClasses } from "@/lib/supabase/classes";

interface Props {
    eleve?: Eleve | null;          // si édition, on passe l'élève existant
  onClose: () => void;
  onSuccess: () => void;
}

export default function ÉlèveForm({ eleve, onClose, onSuccess }: Props) {
  const isEdit = !!eleve;

  const [formData, setFormData] = useState({
    firstName: eleve?.first_name || "",
    lastName: eleve?.last_name || "",
    age: eleve?.age || 15,
    class_id: eleve?.class_id || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

    const [classes, setClasses] = useState<Classe[]>([]);
  
    const itemsPerPage = 5;
  
   // charger les classes au montage
  const fetchClasses = async () => {
      try {
        const data = await getClasses();
        setClasses(data);
      } catch (error) {
        console.error("Erreur lors du chargement des classes :", error);
      }
  };
  /////////////////////////////////////////////////

  useEffect(() => {
    // Focus sur le premier input au montage
    document.getElementById("firstName")?.focus();
    fetchClasses();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Prénom requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Nom requis";
    if (!formData.class_id.trim()) newErrors.class = "Classe requise";
    if (formData.age < 10 || formData.age > 20) newErrors.age = "Âge entre 10 et 20 ans";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Map formData to match Eleve fields and include created_at
    const mappedData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      age: formData.age,
      class_id: formData.class_id,
      created_at: eleve?.created_at || new Date().toISOString(),
    };

    if (isEdit && eleve?.id) {
      await updateEleve(eleve.id, mappedData);
    } else {
      await addEleve(mappedData);
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
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="age">Âge</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className={errors.age ? "border-red-500" : ""}
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div>
              <Label htmlFor="class_id">Classe</Label>
              <select
                id="class_id"
                value={formData.class_id}
                onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                className={errors.class ? "border-red-500" : ""}
              >
                <option value="">Sélectionnez une classe</option>
                {classes.map((classe) => (
                  <option key={classe.id} value={classe.id}>
                    {classe.name}
                  </option>
                ))}
              </select>
              {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class}</p>}
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