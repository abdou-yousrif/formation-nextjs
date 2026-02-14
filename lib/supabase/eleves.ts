import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type Eleve = {
  id: string
  first_name: string
  last_name: string
  age: number
  class_id: string
  created_at: string
  classes?: { name: string }
}

export const getEleves = async (): Promise<Eleve[]> => {
  const { data, error } = await supabase
    .from('students')      // table PostgreSQL
    .select('*, classes(name)') // joindre la table classes pour obtenir le nom de la classe

  if (error) throw error
  return data
}

export const addEleve = async (eleve: Omit<Eleve, 'id'>) => {
  const { data, error } = await supabase
    .from('students')
    .insert([eleve])
    .select()
  if (error) throw error
  return data[0]
}

export const updateEleve = async (id: string, eleve: Partial<Eleve>) => {
  const { data, error } = await supabase
    .from('students')
    .update(eleve)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export const deleteEleve = async (id: string) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}
