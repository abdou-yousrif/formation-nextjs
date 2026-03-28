import { createClient } from "@/lib/supabase/client";

export type Evaluation = {
  id: number;
  eleve_id: number;
  matiere_id: number;
  teacher_id: number;
  type: string;               // "Devoir", "Contrôle", "Examen", etc.
  note: number;               // 0-20
  commentaire?: string | null;
  date: string;               // YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
  eleves?: { first_name: string; last_name: string } | null; // jointure optionnelle
  teachers?: { first_name: string; last_name: string } | null; // jointure optionnelle
  matieres?: { name: string; code?: string } | null;
};

// Pour le draft de notation (interne au composant)
export type DraftEvaluation = {
  eleve_id: string;
  eleve: { first_name: string; last_name: string };
  note: string;        // string pour input facile
  commentaire: string;
};

const supabase = createClient();

export const getEvaluations = async (): Promise<Evaluation[]> => {
  const { data, error } = await supabase
    .from('evaluations')      // table PostgreSQL
    .select('*')
    if(error) throw error
    return data
}

export const addEvaluation = async (evaluation: Omit<Evaluation, 'id'>) => {
  const { data, error } = await supabase
    .from('evaluations')
    .insert([evaluation])
    .select()
  if (error) throw error
  return data[0]
}

export const updateEvaluation = async (id: string, evaluation: Partial<Evaluation>) => {
  const { data, error } = await supabase
    .from('evaluations')
    .update(evaluation)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export const deleteEvaluation = async (id: string) => {
  const { error } = await supabase
    .from('evaluations')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}

// Bulk insert (Supabase gère ça nativement)
export async function addBulkEvaluations(evaluations: Array<Omit<Evaluation, 'id' | 'created_at' | 'updated_at'>>): Promise<void> {
  const { error } = await supabase.from('evaluations').insert(evaluations);
  if (error) throw error;
}

// Optionnel : get pour vérifier existants (si tu veux éditer)
export async function getEvaluationsByClassAndMatiere(classId: number, matiereId: number): Promise<Evaluation[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', supabase.from('evaluations').select('eleve_id').eq('class_id', classId)) // complex, mais tu peux simplifier
    .eq('class_id', classId);
  if (error) throw error;
  return data || [];
}

export async function getMatieresByClass(classId: number) {

  // 1️⃣ récupérer les élèves de la classe
  const { data: students, error: studentsError } = await supabase
    .from("students")
    .select("id")
    .eq("class_id", classId);

  if (studentsError) throw studentsError;

  const studentIds = students?.map(s => s.id) || [];

  if (studentIds.length === 0) return [];

  // 2️⃣ récupérer les matières via les évaluations
  const { data, error } = await supabase
    .from("evaluations")
    .select(`
      matiere_id,
      matieres (
        id,
        name,
        code
      )
    `)
    .in("eleve_id", studentIds);

  if (error) throw error;

  // 3️⃣ supprimer doublons
  const unique = new Map();

  data?.forEach(e => {
    const matiere = e.matieres?.[0];
    if (matiere) {
      unique.set(matiere.id, matiere);
    }
  });

  return Array.from(unique.values());
}