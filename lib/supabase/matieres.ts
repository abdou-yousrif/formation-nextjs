import { createClient } from "@/lib/supabase/client";

export type Matiere = {
  id: number;
  name: string;
  code?: string | null;
  coefficient?: number;
  class_id: number;
  teacher_id: number;
  created_at?: string;
  updated_at?: string;
  // Jointure optionnelle pour plus de confort
  classes?: { name: string } | null;
  teachers?: { first_name: string; last_name: string } | null;
};
const supabase = createClient();

export const getMatieres = async (): Promise<Matiere[]> => {
  const { data, error } = await supabase
    .from('subjects')      // table PostgreSQL
    .select('*, classes(name), teachers(first_name, last_name)') // joindre les tables classes et teachers
    if(error) throw error
    return data
}

export const addMatiere = async (matiere: Omit<Matiere, 'id'>) => {
  const { data, error } = await supabase
    .from('subjects')
    .insert([matiere])
    .select()
  if (error) throw error
  return data[0]
}

export const updateMatiere = async (id: number, matiere: Partial<Matiere>) => {
  const { data, error } = await supabase
    .from('subjects')
    .update(matiere)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export const deleteMatiere = async (id: number) => {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true
}


/* 
-- 1. Table des Professeurs (Teachers)
CREATE TABLE IF NOT EXISTS professeurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger pour updated_at (optionnel mais recommandé)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_professeurs_updated_at
BEFORE UPDATE ON professeurs
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
SQL-- 2. Table des Classes
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,               -- ex: "3ème A", "Terminale S1"
  level TEXT NOT NULL,              -- ex: "3ème", "Terminale", "2nde"
  school_year TEXT NOT NULL,        -- ex: "2025-2026"
  professeur_id UUID REFERENCES professeurs(id) ON DELETE SET NULL,  -- enseignant principal
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON classes
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
SQL-- 3. Table des Élèves
CREATE TABLE IF NOT EXISTS eleves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age SMALLINT CHECK (age >= 10 AND age <= 25),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  parent_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_eleves_updated_at
BEFORE UPDATE ON eleves
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
SQL-- 4. Table des Matières (Subjects)
CREATE TABLE IF NOT EXISTS matieres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,        -- ex: "Mathématiques", "Français", "Physique-Chimie"
  code TEXT UNIQUE,                 -- ex: "MATH", "FR", "PC"
  coefficient SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_matieres_updated_at
BEFORE UPDATE ON matieres
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
SQL-- 5. Table des Évaluations / Notes
-- Une note est liée à un élève + une matière + éventuellement une évaluation (test, devoir, etc.)
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  eleve_id UUID NOT NULL REFERENCES eleves(id) ON DELETE CASCADE,
  matiere_id UUID NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
  type TEXT NOT NULL,               -- ex: "Devoir maison", "Contrôle", "Examen trimestriel"
  note NUMERIC(4,2) CHECK (note >= 0 AND note <= 20),
  commentaire TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_evaluations_updated_at
BEFORE UPDATE ON evaluations
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index pour accélérer les requêtes courantes (moyennes par élève/classe/matière)
CREATE INDEX idx_evaluations_eleve_id ON evaluations(eleve_id);
CREATE INDEX idx_evaluations_matiere_id ON evaluations(matiere_id);
CREATE INDEX idx_evaluations_date ON evaluations(date);



-- Moyenne par élève (toutes matières confondues)
SELECT 
  e.id, e.first_name || ' ' || e.last_name AS nom,
  ROUND(AVG(ev.note), 2) AS moyenne
FROM eleves e
LEFT JOIN evaluations ev ON ev.eleve_id = e.id
GROUP BY e.id;

-- Pourcentage de réussite (>10/20) par classe
SELECT 
  c.name AS classe,
  COUNT(e.id) AS total_eleves,
  COUNT(CASE WHEN AVG(ev.note) >= 10 THEN 1 END) * 100.0 / COUNT(e.id) AS pourcentage_reussite
FROM classes c
JOIN eleves e ON e.class_id = c.id
LEFT JOIN evaluations ev ON ev.eleve_id = e.id
GROUP BY c.id, c.name;

-- Meilleure note par matière (exemple)
SELECT 
  m.name AS matiere,
  MAX(ev.note) AS meilleure_note,
  (SELECT first_name || ' ' || last_name FROM eleves WHERE id = ev.eleve_id) AS eleve
FROM evaluations ev
JOIN matieres m ON m.id = ev.matiere_id
GROUP BY m.id, m.name, ev.eleve_id
ORDER BY meilleure_note DESC
LIMIT 5;
*/