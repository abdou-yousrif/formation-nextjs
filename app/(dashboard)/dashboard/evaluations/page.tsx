// app/eleves/page.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Evaluation, getEvaluations, deleteEvaluation } from "@/lib/supabase/evaluations";
import { Eleve, getEleves } from "@/lib/supabase/eleves";
import { Teacher, getTeachers } from "@/lib/supabase/teachers";
import { Matiere, getMatieres } from "@/lib/supabase/matieres";
import EvaluationTable from "@/components/evaluations/evaluationTable";
import EvaluationForm from "@/components/evaluations/evaluationForm";
import ConfirmationModal from "@/components/confirmationModal";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import GestionListe from "@/components/gestionListe";
import { Button } from "@/components/ui/button";
import EvaluationClassForm from "@/components/evaluations/evaluationClassForm";

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const itemsPerPage = 5;

  // charger les évaluations au montage
  const fetchEvaluations = async () => {
      try {
        const data = await getEvaluations();
        setEvaluations(data);
      } catch (error) {
        console.error("Erreur lors du chargement des évaluations :", error);
      }
  };

  // charger les eleves au montage
  const fetchEleves = async () => {
    try {
      const data = await getEleves();
      setEleves(data);
    } catch (error) {
      console.error("Erreur lors du chargement des élèves :", error);
    }
  };

  // charger les profs au montage
  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Erreur lors du chargement des profs :", error);
    }
  };

  // charger les matieres au montage
  const fetchMatieres = async () => {
    try {
      const data = await getMatieres();
      setMatieres(data);
    } catch (error) {
      console.error("Erreur lors du chargement des matières :", error);
    }
  };
  useEffect(() => {
    const loadData = async () =>{
      fetchEvaluations();
      fetchEleves();
      fetchTeachers();
      fetchMatieres();
    }
    loadData();
  }, []);

 

  const filteredEvaluations = useMemo(() => {
    return evaluations.filter(
      (s) =>
        s.eleves?.first_name.toLowerCase().includes(search.toLowerCase()) ||
        s.eleves?.last_name.toLowerCase().includes(search.toLowerCase()) ||
        s.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [evaluations, search]);

  // Pagination
  const paginatedEvaluations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvaluations.slice(start, start + itemsPerPage);
  }, [filteredEvaluations, currentPage]);

  const totalPages = Math.ceil(filteredEvaluations.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    try {
      await deleteEvaluation(id);
      fetchEvaluations();
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
                        <GestionListe<Evaluation>
                            titre="Gestion des Élèves"
                            placeholderRecherche="Rechercher par nom, prénom ou classe..."
                            items={filteredEvaluations}           // ← ta liste filtrée complète
                            paginatedItems={paginatedEvaluations} // ← items de la page actuelle
                            search={search}
                            setSearch={setSearch}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            onAddClick={() => setIsAddModalOpen(true)}
                            extraHeaderActions={
                              <Button 
                                variant="outline" 
                                className="border-indigo-600 text-indigo-700 hover:bg-indigo-50"
                                onClick={() => setShowBulkModal(true)}
                              >
                                Saisir note par classe
                              </Button>
                            }
                            renderTable={() => (
                                <EvaluationTable
                                evaluations={paginatedEvaluations}
                                onEdit={(Evaluation) => setEditingEvaluation(Evaluation)}
                                onDelete={(id) => setDeleteConfirmId(id)}
                                />
                            )}
                            renderCreateUpdateModal={() =>
                                (isAddModalOpen || editingEvaluation) ? (
                                <EvaluationForm
                                    evaluation={editingEvaluation}
                                    onClose={() => {
                                    setIsAddModalOpen(false);
                                    setEditingEvaluation(null);
                                    }}
                                    onSuccess={fetchEvaluations}
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
                        
                        {showBulkModal && (
                              <EvaluationClassForm
                                onClose={() => setShowBulkModal(false)}
                                onSuccess={() => {
                                  // recharge les évaluations
                                  fetchEvaluations();
                                  setShowBulkModal(false);
                                }}
                              />
                            )}
                    </div>
                </div>
            </div>
        </SidebarInset>
    </SidebarProvider>
  );
}