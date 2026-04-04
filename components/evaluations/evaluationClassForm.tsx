// components/EvaluationClassForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Trash2, Save } from "lucide-react";

// Imports client-safe Supabase

import { Classe, getClasses } from "@/lib/supabase/classes";
import { Eleve, getElevesByClass } from "@/lib/supabase/eleves";
import { Matiere, getMatieres } from "@/lib/supabase/matieres";
import { Teacher, getTeachers } from "@/lib/supabase/teachers";
import { DraftEvaluation, addBulkEvaluations } from "@/lib/supabase/evaluations";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EvaluationClassForm({ onClose, onSuccess }: Props) {
  // Sélections
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedMatiereId, setSelectedMatiereId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Données chargées
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  const [draftEvaluations, setDraftEvaluations] = useState<DraftEvaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ global?: string }>({});

  // Fetch initial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, m, t] = await Promise.all([getClasses(), getMatieres(), getTeachers()]);
        setClasses(c);
        setMatieres(m);
        setTeachers(t);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Charger élèves quand classe change
  useEffect(() => {
    if (!selectedClassId) {
      setDraftEvaluations([]);
      setSelectedMatiereId("");
      setSelectedTeacherId("");
      return;
    }

    const loadEleves = async () => {
      try {
        const eleves = await getElevesByClass(selectedClassId);
        const draft = eleves.map(e => ({
          eleve_id: e.id,
          eleve: { first_name: e.first_name, last_name: e.last_name },
          note: "",
          commentaire: "",
        }));
        setDraftEvaluations(draft);
      } catch (err) {
        console.error(err);
      }
    };
    loadEleves();
  }, [selectedClassId]);

  // Filtrer les professeurs
  useEffect(() => {
    if (!selectedClassId || !selectedMatiereId) {
      setFilteredTeachers(teachers);
      setSelectedTeacherId("");
      return;
    }

    const possibleTeachers = teachers.filter(t => true); // filtrage futur si nécessaire
    setFilteredTeachers(possibleTeachers);

    if (!possibleTeachers.some(t => t.id === Number(selectedTeacherId))) {
      setSelectedTeacherId("");
    }
  }, [selectedClassId, selectedMatiereId, teachers]);

  const updateDraft = (index: number, field: 'note' | 'commentaire', value: string) => {
    setDraftEvaluations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeFromDraft = (index: number) => {
    setDraftEvaluations(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    if (!selectedClassId || !selectedMatiereId || !selectedTeacherId || !selectedType.trim()) {
      setErrors({ global: "Veuillez sélectionner la classe, la matière, le professeur et le type de note" });
      return;
    }

    const validNotes = draftEvaluations.filter(d => { 
      const n = Number(d.note);
      return d.note.trim() !== "" && !isNaN(n) && n >= 0 && n <= 20;
    });

    if (validNotes.length === 0) {
      setErrors({ global: "Aucune note valide saisie" });
      return;
    }

    const toSave = validNotes.map(d => ({
      eleve_id: d.eleve_id,
      matiere_id: Number(selectedMatiereId),
      teacher_id: Number(selectedTeacherId),
      type: selectedType.trim(),
      note: Number(d.note),
      commentaire: d.commentaire.trim() || null,
      date: selectedDate,
    }));

    setLoading(true);
    try {
      await addBulkEvaluations(toSave);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ global: "Erreur lors de l'enregistrement des notes" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Saisie des notes par classe – Matière & Professeur</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Filtres */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 bg-white border-b shadow-sm">
          <div>
            <Label className="mb-1.5 block">Classe</Label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choisir une classe</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.level ? `(${c.level})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-1.5 block">Matière</Label>
            <select
              value={selectedMatiereId}
              onChange={e => setSelectedMatiereId(e.target.value)}
              disabled={!selectedClassId}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Choisir une matière</option>
              {matieres.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.code ? `(${m.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-1.5 block">Professeur</Label>
            <select
              value={selectedTeacherId}
              onChange={e => setSelectedTeacherId(e.target.value)}
              disabled={!selectedMatiereId}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Choisir le professeur</option>
              {filteredTeachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-1.5 block">Type d'évaluation</Label>
            <Input
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              placeholder="Contrôle, Devoir surveillé, Examen..."
              className="w-full"
            />
          </div>

          <div>
            <Label className="mb-1.5 block">Date</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Table des élèves */}
        {draftEvaluations.length > 0 ? (
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <table className="w-full border-collapse min-w-max">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700 border-b">Élève</th>
                  <th className="p-4 text-center font-semibold text-gray-700 border-b w-28">Note (/20)</th>
                  <th className="p-4 text-left font-semibold text-gray-700 border-b">Commentaire</th>
                  <th className="p-4 text-center font-semibold text-gray-700 border-b w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {draftEvaluations.map((draft, idx) => (
                  <tr key={draft.eleve_id} className="border-b hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-medium">
                      {draft.eleve.first_name} {draft.eleve.last_name}
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        step={0.25}
                        value={draft.note}
                        onChange={e => updateDraft(idx, 'note', e.target.value)}
                        className="text-center w-full"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        value={draft.commentaire}
                        onChange={e => updateDraft(idx, 'commentaire', e.target.value)}
                        placeholder="Observation, point fort/faible..."
                        className="w-full"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromDraft(idx)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
            {selectedClassId 
              ? "Aucun élève dans cette classe ou chargement en cours..." 
              : "Sélectionnez une classe pour voir les élèves"}
          </div>
        )}

        {/* Footer */}
        <div className="p-5 border-t bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          {errors.global && (
            <p className="text-red-600 font-medium text-sm">{errors.global}</p>
          )}
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveAll}
              disabled={loading || draftEvaluations.length === 0 || !selectedTeacherId}
              className="bg-indigo-600 hover:bg-indigo-700 min-w-[220px]"
            >
              {loading 
                ? "Enregistrement en cours..." 
                : `Enregistrer ${draftEvaluations.filter(d => d.note.trim() !== "").length} notes`}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Trash2, Save } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

// ─── Types locaux (évite les imports croisés problématiques) ───────────────────

type Classe = { id: number; name: string; level?: string };
type Matiere = { id: number; name: string; code?: string | null; coefficient?: number };
type Teacher = { id: number; first_name: string; last_name: string };
type Eleve   = { id: number; first_name: string; last_name: string };

type DraftEvaluation = {
  eleve_id: number;
  eleve: { first_name: string; last_name: string };
  note: string;
  commentaire: string;
};

type EvalToSave = {
  eleve_id: number;
  matiere_id: number;
  teacher_id: number;
  type: string;
  note: number;
  commentaire: string | null;
  date: string;
};

// ─── Fonctions Supabase inline (évite les problèmes de modules serveur) ────────

const supabase = createClient();

async function fetchClasses(): Promise<Classe[]> {
  const { data, error } = await supabase.from("classes").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

async function fetchMatieres(): Promise<Matiere[]> {
  const { data, error } = await supabase.from("subjects").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

async function fetchTeachers(): Promise<Teacher[]> {
  const { data, error } = await supabase
    .from("teachers")
    .select("id, first_name, last_name")
    .order("last_name");
  if (error) throw error;
  return data ?? [];
}

async function fetchElevesByClass(classId: string): Promise<Eleve[]> {
  const { data, error } = await supabase
    .from("students")
    .select("id, first_name, last_name")
    .eq("class_id", classId)
    .order("last_name");
  if (error) throw error;
  return data ?? [];
}

async function bulkInsertEvaluations(evaluations: EvalToSave[]): Promise<void> {
  const { error } = await supabase.from("evaluations").insert(evaluations);
  if (error) throw error;
}

// ─── Composant ─────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EvaluationClassForm({ onClose, onSuccess }: Props) {
  const [selectedClassId,   setSelectedClassId]   = useState("");
  const [selectedMatiereId, setSelectedMatiereId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedType,      setSelectedType]      = useState("");
  const [selectedDate,      setSelectedDate]      = useState(
    new Date().toISOString().split("T")[0]
  );

  const [classes,  setClasses]  = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [draftEvaluations, setDraftEvaluations] = useState<DraftEvaluation[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [initLoad, setInitLoad] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Chargement initial ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [c, m, t] = await Promise.all([fetchClasses(), fetchMatieres(), fetchTeachers()]);
        setClasses(c);
        setMatieres(m);
        setTeachers(t);
      } catch (err) {
        console.error("Erreur chargement initial :", err);
        setErrorMsg("Impossible de charger les données. Vérifiez votre connexion.");
      } finally {
        setInitLoad(false);
      }
    })();
  }, []);

  // ── Chargement des élèves quand la classe change ────────────────────────────
  useEffect(() => {
    if (!selectedClassId) {
      setDraftEvaluations([]);
      setSelectedMatiereId("");
      setSelectedTeacherId("");
      return;
    }

    setDraftEvaluations([]); // reset pendant le chargement

    (async () => {
      try {
        const eleves = await fetchElevesByClass(selectedClassId);
        setDraftEvaluations(
          eleves.map((e) => ({
            eleve_id: e.id,
            eleve: { first_name: e.first_name, last_name: e.last_name },
            note: "",
            commentaire: "",
          }))
        );
      } catch (err) {
        console.error("Erreur chargement élèves :", err);
        setErrorMsg("Impossible de charger les élèves de cette classe.");
      }
    })();
  }, [selectedClassId]);

  // ── Reset prof si matière change ────────────────────────────────────────────
  useEffect(() => {
    setSelectedTeacherId("");
  }, [selectedMatiereId]);

  // ── Mise à jour d'un champ dans le draft ────────────────────────────────────
  const updateDraft = (index: number, field: "note" | "commentaire", value: string) => {
    setDraftEvaluations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeFromDraft = (index: number) => {
    setDraftEvaluations((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Sauvegarde ──────────────────────────────────────────────────────────────
  const handleSaveAll = async () => {
    setErrorMsg(null);

    if (!selectedClassId || !selectedMatiereId || !selectedTeacherId || !selectedType.trim()) {
      setErrorMsg("Veuillez sélectionner la classe, la matière, le professeur et le type d'évaluation.");
      return;
    }

    const validNotes = draftEvaluations.filter((d) => {
      const n = parseFloat(d.note);
      return d.note.trim() !== "" && !isNaN(n) && n >= 0 && n <= 20;
    });

    if (validNotes.length === 0) {
      setErrorMsg("Aucune note valide saisie (valeur entre 0 et 20).");
      return;
    }

    const toSave: EvalToSave[] = validNotes.map((d) => ({
      eleve_id:    d.eleve_id,
      matiere_id:  Number(selectedMatiereId),
      teacher_id:  Number(selectedTeacherId),
      type:        selectedType.trim(),
      note:        parseFloat(d.note),
      commentaire: d.commentaire.trim() || null,
      date:        selectedDate,
    }));

    setLoading(true);
    try {
      await bulkInsertEvaluations(toSave);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erreur enregistrement :", err);
      setErrorMsg(
        err?.message
          ? `Erreur Supabase : ${err.message}`
          : "Erreur lors de l'enregistrement. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  const filledCount = draftEvaluations.filter((d) => d.note.trim() !== "").length;

  // ── Rendu ───────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden">

        
        <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            Saisie des notes par classe
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white border-b shrink-0">

         
          <div>
            <Label className="mb-1 block text-sm font-medium">Classe</Label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={initLoad}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">— Choisir —</option>
              {classes.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}{c.level ? ` (${c.level})` : ""}
                </option>
              ))}
            </select>
          </div>

         
          <div>
            <Label className="mb-1 block text-sm font-medium">Matière</Label>
            <select
              value={selectedMatiereId}
              onChange={(e) => setSelectedMatiereId(e.target.value)}
              disabled={!selectedClassId}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">— Choisir —</option>
              {matieres.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.name}{m.code ? ` (${m.code})` : ""}
                  {m.coefficient ? ` — coef. ${m.coefficient}` : ""}
                </option>
              ))}
            </select>
          </div>

          
          <div>
            <Label className="mb-1 block text-sm font-medium">Professeur</Label>
            <select
              value={selectedTeacherId}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              disabled={!selectedMatiereId}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">— Choisir —</option>
              {teachers.map((t) => (
                <option key={t.id} value={String(t.id)}>
                  {t.first_name} {t.last_name}
                </option>
              ))}
            </select>
          </div>

         
          <div>
            <Label className="mb-1 block text-sm font-medium">Type</Label>
            <Input
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              placeholder="Contrôle, Devoir, Examen…"
              className="text-sm"
            />
          </div>

         
          <div>
            <Label className="mb-1 block text-sm font-medium">Date</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-sm"
            />
          </div>
        </div>

       
        <div className="flex-1 overflow-auto bg-gray-50">
          {draftEvaluations.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">#</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Élève</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b w-32">Note /20</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Commentaire</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 border-b w-14">Suppr.</th>
                </tr>
              </thead>
              <tbody>
                {draftEvaluations.map((draft, idx) => (
                  <tr
                    key={draft.eleve_id}
                    className={`border-b transition-colors ${
                      draft.note.trim() !== "" ? "bg-blue-50/40" : "hover:bg-gray-100/60"
                    }`}
                  >
                    <td className="px-4 py-2 text-sm text-gray-400">{idx + 1}</td>
                    <td className="px-4 py-2 font-medium text-sm">
                      {draft.eleve.last_name} {draft.eleve.first_name}
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        step={0.25}
                        value={draft.note}
                        onChange={(e) => updateDraft(idx, "note", e.target.value)}
                        className="text-center w-full text-sm"
                        placeholder="—"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={draft.commentaire}
                        onChange={(e) => updateDraft(idx, "commentaire", e.target.value)}
                        placeholder="Observation optionnelle…"
                        className="text-sm"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromDraft(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 py-16">
              {initLoad ? (
                <p>Chargement…</p>
              ) : selectedClassId ? (
                <p>Aucun élève trouvé dans cette classe.</p>
              ) : (
                <p>Sélectionnez une classe pour afficher les élèves.</p>
              )}
            </div>
          )}
        </div>

       
        <div className="p-4 border-t bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex-1">
            {errorMsg && (
              <p className="text-sm text-red-600 font-medium">{errorMsg}</p>
            )}
            {!errorMsg && draftEvaluations.length > 0 && (
              <p className="text-sm text-gray-500">
                {filledCount} / {draftEvaluations.length} note{filledCount > 1 ? "s" : ""} saisie{filledCount > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button
              onClick={handleSaveAll}
              disabled={
                loading ||
                filledCount === 0 ||
                !selectedTeacherId ||
                !selectedType.trim()
              }
              className="bg-indigo-600 hover:bg-indigo-700 min-w-[200px]"
            >
              {loading ? (
                "Enregistrement…"
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer {filledCount > 0 ? `${filledCount} note${filledCount > 1 ? "s" : ""}` : ""}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
*/
/* // components/EvaluationClassForm.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Trash2, Save } from "lucide-react";
import { Classe, getClasses } from "@/lib/supabase/classes";
import { Eleve, getElevesByClass } from "@/lib/supabase/eleves";
import { Matiere, getMatieres } from "@/lib/supabase/matieres";
import { Teacher, getTeachers } from "@/lib/supabase/teachers";
import { DraftEvaluation, addBulkEvaluations } from "@/lib/supabase/evaluations";


interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function EvaluationClassForm({ onClose, onSuccess }: Props) {
  // Sélections
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedMatiereId, setSelectedMatiereId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Données chargées
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]); // profs filtrés

  const [draftEvaluations, setDraftEvaluations] = useState<DraftEvaluation[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ global?: string }>({});

  // Fetch initial
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, m, t] = await Promise.all([getClasses(), getMatieres(), getTeachers()]);
        setClasses(c);
        setMatieres(m);
        setTeachers(t);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Charger élèves quand classe change
  useEffect(() => {
    if (!selectedClassId) {
      setDraftEvaluations([]);
      setSelectedMatiereId("");
      setSelectedTeacherId("");
      return;
    }

    const loadEleves = async () => {
      try {
        const eleves = await getElevesByClass(selectedClassId);
        const draft = eleves.map(e => ({
          eleve_id: e.id,
          eleve: { first_name: e.first_name, last_name: e.last_name },
          note: "",
          commentaire: "",
        }));
        setDraftEvaluations(draft);
      } catch (err) {
        console.error(err);
      }
    };
    loadEleves();
  }, [selectedClassId]);

  // Filtrer les professeurs en fonction de classe + matière (simplifié)
  useEffect(() => {
    if (!selectedClassId || !selectedMatiereId) {
      setFilteredTeachers(teachers);
      setSelectedTeacherId("");
      return;
    }

    // Version simple : tous les profs (à remplacer par requête si tu as teacher_assignments)
    const possibleTeachers = teachers.filter(t => 
      // Ici tu peux ajouter une condition si tu as une table de liaison
      true // ← remplace par vraie logique plus tard
    );
    setFilteredTeachers(possibleTeachers);

    // Reset prof si plus valide
    if (!possibleTeachers.some(t => t.id === Number(selectedTeacherId))) {
      setSelectedTeacherId("");
    }
  }, [selectedClassId, selectedMatiereId, teachers]);

  const updateDraft = (index: number, field: 'note' | 'commentaire', value: string) => {
    setDraftEvaluations(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeFromDraft = (index: number) => {
    setDraftEvaluations(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    if (!selectedClassId || !selectedMatiereId || !selectedTeacherId || !selectedType.trim()) {
      setErrors({ global: "Veuillez sélectionner la classe, la matière, le professeur et le type de note" });
      return;
    }

    const validNotes = draftEvaluations.filter(d => { 
      const n = Number(d.note);
      return d.note.trim() !== "" && !isNaN(n) && n >= 0 && n <= 20;
    });

    if (validNotes.length === 0) {
      setErrors({ global: "Aucune note valide saisie" });
      return;
    }

    const toSave = validNotes.map(d => ({
      eleve_id: d.eleve_id,
      matiere_id: Number(selectedMatiereId),
      teacher_id: Number(selectedTeacherId),
      type: selectedType.trim(),
      note: Number(d.note),
      commentaire: d.commentaire.trim() || null,
      date: selectedDate,
    }));

    setLoading(true);
    try {
      await addBulkEvaluations(toSave);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ global: "Erreur lors de l'enregistrement des notes" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[96vh] flex flex-col overflow-hidden">
        
        <div className="p-5 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Saisie des notes par classe – Matière & Professeur</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>


        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 bg-white border-b shadow-sm">
          <div>
            <Label className="mb-1.5 block">Classe</Label>
            <select
              value={selectedClassId}
              onChange={e => setSelectedClassId(e.target.value)}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choisir une classe</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.level ? `(${c.level})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-1.5 block">Matière</Label>
            <select
              value={selectedMatiereId}
              onChange={e => setSelectedMatiereId(e.target.value)}
              disabled={!selectedClassId}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Choisir une matière</option>
              {matieres.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.code ? `(${m.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-1.5 block">Professeur</Label>
            <select
              value={selectedTeacherId}
              onChange={e => setSelectedTeacherId(e.target.value)}
              disabled={!selectedMatiereId}
              className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Choisir le professeur</option>
              {filteredTeachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="mb-1.5 block">Type d'évaluation</Label>
            <Input
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              placeholder="Contrôle, Devoir surveillé, Examen..."
              className="w-full"
            />
          </div>

          <div>
            <Label className="mb-1.5 block">Date</Label>
            <Input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
        </div>


        {draftEvaluations.length > 0 ? (
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <table className="w-full border-collapse min-w-max">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr>
                  <th className="p-4 text-left font-semibold text-gray-700 border-b">Élève</th>
                  <th className="p-4 text-center font-semibold text-gray-700 border-b w-28">Note (/20)</th>
                  <th className="p-4 text-left font-semibold text-gray-700 border-b">Commentaire</th>
                  <th className="p-4 text-center font-semibold text-gray-700 border-b w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {draftEvaluations.map((draft, idx) => (
                  <tr key={draft.eleve_id} className="border-b hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 font-medium">
                      {draft.eleve.first_name} {draft.eleve.last_name}
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        step={0.25}
                        value={draft.note}
                        onChange={e => updateDraft(idx, 'note', e.target.value)}
                        className="text-center w-full"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        value={draft.commentaire}
                        onChange={e => updateDraft(idx, 'commentaire', e.target.value)}
                        placeholder="Observation, point fort/faible..."
                        className="w-full"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromDraft(idx)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
            {selectedClassId 
              ? "Aucun élève dans cette classe ou chargement en cours..." 
              : "Sélectionnez une classe pour voir les élèves"}
          </div>
        )}

        <div className="p-5 border-t bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
          {errors.global && (
            <p className="text-red-600 font-medium text-sm">{errors.global}</p>
          )}
          
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSaveAll}
              disabled={loading || draftEvaluations.length === 0 || !selectedTeacherId}
              className="bg-indigo-600 hover:bg-indigo-700 min-w-[220px]"
            >
              {loading 
                ? "Enregistrement en cours..." 
                : `Enregistrer ${draftEvaluations.filter(d => d.note.trim() !== "").length} notes`}
              <Save className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} */