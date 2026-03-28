// app/eleves/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Teacher, getTeachers, deleteTeacher } from "@/lib/supabase/teachers";
import TeacherTable from "@/components/teachers/teacherTable";
import TeacherForm from "@/components/teachers/teacherForm";
import ConfirmationModal from "@/components/confirmationModal";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import GestionListe from "@/components/gestionListe";

export default function ElevesPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const itemsPerPage = 5;

  // charger les élèves au montage
  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Erreur lors du chargement des profs :", error);
    }
  };

useEffect(() => {
  const loadData = async () => {
    await fetchTeachers();
  };

  loadData();
}, []);

 

  const filteredTeacherss = useMemo(() => {
    return teachers.filter(
      (s) =>
        s.first_name.toLowerCase().includes(search.toLowerCase()) ||
        s.last_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [teachers, search]);

  // Pagination
  const paginatedTeachers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTeacherss.slice(start, start + itemsPerPage);
  }, [filteredTeacherss, currentPage]);

  const totalPages = Math.ceil(filteredTeacherss.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    try {
      await deleteTeacher(id);
      fetchTeachers();
    } catch (error) {
      console.error("Erreur lors de la suppression du prof :", error);
    }
    setDeleteConfirmId(null);
  };

  return (
    <SidebarProvider
        style={
        {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
        }
    >
        <AppSidebar variant="inset" />
        <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <GestionListe<Teacher>
                            titre="Gestion des profs"
                            placeholderRecherche="Rechercher par nom, prénom "
                            items={filteredTeacherss}           // ← ta liste filtrée complète
                            paginatedItems={paginatedTeachers} // ← items de la page actuelle
                            search={search}
                            setSearch={setSearch}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            onAddClick={() => setIsAddModalOpen(true)}
                            renderTable={() => (
                                <TeacherTable
                                teachers={paginatedTeachers}
                                onEdit={(teacher) => setEditingTeacher(teacher)}
                                onDelete={(id) => setDeleteConfirmId(id)}
                                />
                            )}
                            renderCreateUpdateModal={() =>
                                (isAddModalOpen || editingTeacher) ? (
                                <TeacherForm
                                    teacher={editingTeacher}
                                    onClose={() => {
                                    setIsAddModalOpen(false);
                                    setEditingTeacher(null);
                                    }}
                                    onSuccess={fetchTeachers}
                                />
                                ) : null
                            }
                            renderDeleteConfirmModal={() =>
                                deleteConfirmId ? (
                                <ConfirmationModal
                                    title="Supprimer ce prof ?"
                                    message="Cette action est irréversible."
                                    onConfirm={() => handleDelete(deleteConfirmId)}
                                    onCancel={() => setDeleteConfirmId(null)}
                                />
                                ) : null
                            }
                        />
                    </div>
                </div>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}