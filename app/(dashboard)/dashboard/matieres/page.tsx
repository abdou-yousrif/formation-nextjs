// app/Matieres/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Matiere, getMatieres, deleteMatiere } from "@/lib/supabase/matieres";
import MatiereTable from "@/components/matieres/matiereTable";
import MatiereForm from "@/components/matieres/matiereForm";
import ConfirmationModal from "@/components/confirmationModal";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import GestionListe from "@/components/gestionListe";

export default function MatieresPage() {
  const [matieres, setMatieres] = useState<Matiere[]>(/* await getMatieres() */[]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);


  const itemsPerPage = 5;

  // charger les élèves au montage
  const fetchMatieres = async () => {
    try {
      const data = await getMatieres();
      setMatieres(data);
    } catch (error) {
      console.error("Erreur lors du chargement des matieres :", error);
    }
};

useEffect(() => {
  const loadData = async () => {
    await fetchMatieres();
  };

  loadData();
}, []);

 

  const filteredMatieres = useMemo(() => {
    return matieres.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code?.toLowerCase().includes(search.toLowerCase())
    );
  }, [matieres, search]);

  // Pagination
  const paginatedMatieres = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMatieres.slice(start, start + itemsPerPage);
  }, [filteredMatieres, currentPage]);

  const totalPages = Math.ceil(filteredMatieres.length / itemsPerPage);

  /* const refreshMatieres = () => setMatieres([...getMatieres()]); */ // force re-render après CRUD

  const handleDelete = async (id: string) => {
    try {
      await deleteMatiere(id);
      fetchMatieres();
    } catch (error) {
      console.error("Erreur lors de la suppression de la matiere :", error);
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
                        <GestionListe<Matiere>
                            titre="Gestion des matieres"
                            placeholderRecherche="Rechercher par libelle, code, ..."
                            items={filteredMatieres}           // ← ta liste filtrée complète
                            paginatedItems={paginatedMatieres} // ← items de la page actuelle
                            search={search}
                            setSearch={setSearch}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            onAddClick={() => setIsAddModalOpen(true)}
                            renderTable={() => (
                                <MatiereTable
                                matieres={paginatedMatieres}
                                onEdit={(matiere) => setEditingMatiere(matiere)}
                                onDelete={(id) => setDeleteConfirmId(id)}
                                />
                            )}
                            renderCreateUpdateModal={() =>
                                (isAddModalOpen || editingMatiere) ? (
                                <MatiereForm
                                    matiere={editingMatiere}
                                    onClose={() => {
                                    setIsAddModalOpen(false);
                                    setEditingMatiere(null);
                                    }}
                                    onSuccess={fetchMatieres}
                                />
                                ) : null
                            }
                            renderDeleteConfirmModal={() =>
                                deleteConfirmId ? (
                                <ConfirmationModal
                                    title="Supprimer cette matiere ?"
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