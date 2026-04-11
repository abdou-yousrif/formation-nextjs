import { createClient } from "@/lib/supabase/client";
import { Matiere } from "./matieres";
import { Eleve } from "./eleves";
export type Classe = {
  id: number
  name: string
  level: string
  // Optionnel : pour les jointures quand tu fais un include/relations
  eleves?: Eleve[];
  matieres?: Matiere[];
}

const supabase = createClient();

export const getClasses = async (): Promise<Classe[]> => {
  const { data, error } = await supabase
    .from('classes')      // table PostgreSQL
    .select('*')

  if (error) throw error
  return data
}

export const addClasse = async (classe: Omit<Classe, 'id'>) => {
  const { data, error } = await supabase
    .from('classes')
    .insert([classe])
    .select()
  if (error) throw error
  return data[0]
}

export const updateClasse = async (id: number, classe: Partial<Classe>) => {
  const { data, error } = await supabase
    .from('classes')
    .update(classe)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export const deleteClasse = async (id: number) => {
  const { error } = await supabase
    .from('classes')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}
