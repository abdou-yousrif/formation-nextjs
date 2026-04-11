//teacher_assignments
import { createClient } from "@/lib/supabase/client";

export type teacherAssignments = {
  id: number;
  class_id: number;
  subject_id: number;
  teacher_id: number;
};

const supabase = createClient();

export const upsertTeacherAssignments = async (assignments: Omit<teacherAssignments, 'id'>[]) => {
  const { error } = await supabase
    .from('teacherAssignments')
    .upsert(assignments, {
      onConflict: 'class_id,subject_id'
    });

  if (error) throw error;
};

export const getTeacherAssignmentsByClass = async (classId: number) => {
  const { data, error } = await supabase
    .from('teacherAssignments')
    .select(`
      *,
      subjects(id, name),
      teachers(id, first_name, last_name)
    `)
    .eq('class_id', classId);

  if (error) throw error;
  return data;
};