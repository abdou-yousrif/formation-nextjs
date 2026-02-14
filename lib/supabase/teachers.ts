import { createClient } from "@/lib/supabase/client";

export type Teacher = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

const supabase = createClient();

export const getTeachers = async (): Promise<Teacher[]> => {
  const { data, error } = await supabase
    .from('teachers')      // table PostgreSQL
    .select('*')
    if(error) throw error
    return data
}

export const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
  const { data, error } = await supabase
    .from('teachers')
    .insert([teacher])
    .select()
  if (error) throw error
  return data[0]
}

export const updateTeacher = async (id: string, teacher: Partial<Teacher>) => {
  const { data, error } = await supabase
    .from('teachers')
    .update(teacher)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export const deleteTeacher = async (id: string) => {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}