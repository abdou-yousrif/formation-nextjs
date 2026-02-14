// lib/data/mockStudents.ts
export interface Eleve {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    class: string; 
    email?: string;
    parentPhone?: string;
    createdAt: string;
  }
  
  export let mockEleves: Eleve[] = [
    { id: "1", firstName: "Amir", lastName: "Ben Ali", age: 15, class: "3ème A", email: "amir@example.com", parentPhone: "+216 98 123 456", createdAt: "2025-09-01" },
    { id: "2", firstName: "Sara", lastName: "Trabelsi", age: 16, class: "2nde", email: "sara.t@example.com", createdAt: "2025-09-02" },
    { id: "3", firstName: "Chloé", lastName: "Lefevre", age: 12, class: "6A", email: "chloe.lefevre@example.com", parentPhone: "0611121314", createdAt: "2026-01-23T10:10:00Z" },
    { id: "4", firstName: "Mathis", lastName: "Moreau", age: 14, class: "7A", email: "mathis.moreau@example.com", parentPhone: "0615161718", createdAt: "2026-01-23T10:15:00Z" },
    { id: "5", firstName: "Emma", lastName: "Roux", age: 13, class: "7B", email: "emma.roux@example.com", parentPhone: "0619202122", createdAt: "2026-01-23T10:20:00Z" },
    { id: "6", firstName: "Lucas", lastName: "Petit", age: 12, class: "6C", email: "lucas.petit@example.com", parentPhone: "0623242526", createdAt: "2026-01-23T10:25:00Z" },
    { id: "7", firstName: "Sarah", lastName: "Bernard", age: 14, class: "7A", email: "sarah.bernard@example.com", parentPhone: "0627282930", createdAt: "2026-01-23T10:30:00Z" },
    { id: "8", firstName: "Noah", lastName: "Faure", age: 13, class: "7B", email: "noah.faure@example.com", parentPhone: "0631323334", createdAt: "2026-01-23T10:35:00Z" },
    { id: "9", firstName: "Lina", lastName: "Garcia", age: 12, class: "6C", email: "lina.garcia@example.com", parentPhone: "0635363738", createdAt: "2026-01-23T10:40:00Z" },
    { id: "10", firstName: "Ethan", lastName: "Michel", age: 14, class: "7A", email: "ethan.michel@example.com", parentPhone: "0639404142", createdAt: "2026-01-23T10:45:00Z" }
  ];
  
  
  export function getEleves(): Eleve[] {
    return mockEleves;
  }
  
  export function addEleve(eleve: Omit<Eleve, "id" | "createdAt">): Eleve {
    const newId = (mockEleves.length + 1).toString();
    const newEleve: Eleve = {
      ...eleve,
      id: newId,
      createdAt: new Date().toISOString().split("T")[0],
    };
    mockEleves.push(newEleve);
    return newEleve;
  }
  
  export function updateEleve(id: string, updates: Partial<Eleve>): Eleve | null {
    const index = mockEleves.findIndex(s => s.id === id);
    if (index === -1) return null;
    mockEleves[index] = { ...mockEleves[index], ...updates };
    return mockEleves[index];
  }
  
  export function deleteEleve(id: string): boolean {
    const initialLength = mockEleves.length;
    mockEleves = mockEleves.filter(s => s.id !== id);
    return mockEleves.length < initialLength;
  }