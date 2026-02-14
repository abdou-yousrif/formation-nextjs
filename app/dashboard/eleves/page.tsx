// app/eleves/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Eleve, getEleves, deleteEleve } from "@/lib/supabase/eleves";
import { Classe, getClasses } from "@/lib/supabase/classes";
import EleveTable from "../../../components/eleveTable";
import EleveForm from "../../../components/eleveForm";
import ConfirmationModal from "../../../components/confirmationModal";
import { SidebarInset, SidebarProvider } from "../../../components/ui/sidebar";
import { SiteHeader } from "../../../components/site-header";
import { AppSidebar } from "../../../components/app-sidebar";
import GestionListe from "../../../components/gestionListe";
import { tr } from "zod/v4/locales";

export default function ElevesPage() {
  const [eleves, setEleves] = useState<Eleve[]>(/* await getEleves() */[]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEleve, setEditingEleve] = useState<Eleve | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [classes, setClasses] = useState<Classe[]>([]);

  const itemsPerPage = 5;

  // charger les élèves au montage
  const fetchEleves = async () => {
    try {
      const data = await getEleves();
      setEleves(data);
    } catch (error) {
      console.error("Erreur lors du chargement des élèves :", error);
    }
};
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
    fetchEleves();
    fetchClasses();
}, []);

 

  const filteredEleves = useMemo(() => {
    return eleves.filter(
      (s) =>
        s.first_name.toLowerCase().includes(search.toLowerCase()) ||
        s.last_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [eleves, search]);

  // Pagination
  const paginatedEleves = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEleves.slice(start, start + itemsPerPage);
  }, [filteredEleves, currentPage]);

  const totalPages = Math.ceil(filteredEleves.length / itemsPerPage);

  /* const refreshEleves = () => setEleves([...getEleves()]); */ // force re-render après CRUD

  const handleDelete = async (id: string) => {
    try {
      await deleteEleve(id);
      fetchEleves();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élève :", error);
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
                        <GestionListe<Eleve>
                            titre="Gestion des Élèves"
                            placeholderRecherche="Rechercher par nom, prénom ou classe..."
                            items={filteredEleves}           // ← ta liste filtrée complète
                            paginatedItems={paginatedEleves} // ← items de la page actuelle
                            search={search}
                            setSearch={setSearch}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            onAddClick={() => setIsAddModalOpen(true)}
                            renderTable={() => (
                                <EleveTable
                                eleves={paginatedEleves}
                                onEdit={(eleve) => setEditingEleve(eleve)}
                                onDelete={(id) => setDeleteConfirmId(id)}
                                />
                            )}
                            renderCreateUpdateModal={() =>
                                (isAddModalOpen || editingEleve) ? (
                                <EleveForm
                                    eleve={editingEleve}
                                    onClose={() => {
                                    setIsAddModalOpen(false);
                                    setEditingEleve(null);
                                    }}
                                    onSuccess={fetchEleves}
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