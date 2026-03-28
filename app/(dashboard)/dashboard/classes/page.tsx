// app/eleves/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Classe, deleteClasse, getClasses } from "@/lib/supabase/classes";
import ClasseTable from "@/components/classes/classeTable";
import ConfirmationModal from "@/components/confirmationModal";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import GestionListe from "@/components/gestionListe";
import ClasseForm from "@/components/classes/classeForm";

export default function ClassesPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClasse, setEditingClasse] = useState<Classe | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
useEffect(() => {
    const loadData = async () => {
      await fetchClasses();
    }
    loadData();
}, []);

 

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.level.toLowerCase().includes(search.toLowerCase())
    );
  }, [classes, search]);

  // Pagination
  const paginatedEleves = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClasses.slice(start, start + itemsPerPage);
  }, [filteredClasses, currentPage]);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  /* const refreshClasses = () => setClasses([...getClasses()]); */ // force re-render après CRUD
  const handleDelete = async (id: string) => {
    try {
      await deleteClasse(id);
      fetchClasses();
    } catch (error) {
      console.error("Erreur lors de la suppression de la classe :", error);
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
                        <GestionListe<Classe>
                            titre="Gestion des Classes"
                            placeholderRecherche="Rechercher par nom ou niveau..."
                            items={filteredClasses}           // ← ta liste filtrée complète
                            paginatedItems={paginatedEleves} // ← items de la page actuelle
                            search={search}
                            setSearch={setSearch}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            onAddClick={() => setIsAddModalOpen(true)}
                            renderTable={() => (
                                <ClasseTable
                                classes={paginatedEleves}
                                onEdit={(classe) => setEditingClasse(classe)}
                                onDelete={(id) => setDeleteConfirmId(id)}
                                />
                            )}
                            renderCreateUpdateModal={() =>
                                (isAddModalOpen || editingClasse) ? (
                                <ClasseForm
                                    classe={editingClasse}
                                    onClose={() => {
                                    setIsAddModalOpen(false);
                                    setEditingClasse(null);
                                    }}
                                    onSuccess={fetchClasses}
                                />
                                ) : null
                            }
                            renderDeleteConfirmModal={() =>
                                deleteConfirmId ? (
                                <ConfirmationModal
                                    title="Supprimer cet élève ?"
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