// components/GestionListe.tsx
"use client";

import { ReactNode, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ou tes icônes

interface Props<T> {
  titre: string;
  placeholderRecherche: string;
  items: T[];                      // la liste complète filtrée/paginée
  paginatedItems: T[];             // items de la page actuelle
  search: string;
  setSearch: (value: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  onAddClick: () => void;
  renderTable: () => ReactNode;    // la table (ÉlèveTable, ClasseTable, etc.)
  renderCreateUpdateModal: () => ReactNode; // modal form quand ouvert
  renderDeleteConfirmModal: () => ReactNode; // modal suppression
}

export default function GestionListe<T>({
  titre,
  placeholderRecherche,
  items,
  paginatedItems,
  search,
  setSearch,
  currentPage,
  setCurrentPage,
  totalPages,
  onAddClick,
  renderTable,
  renderCreateUpdateModal,
  renderDeleteConfirmModal,
}: Props<T>) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{titre}</h1>
        <Button onClick={onAddClick}>
          + Ajouter
        </Button>
      </div>

      {/* Recherche */}
      <div className="flex gap-4">
        <Input
          placeholder={placeholderRecherche}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md"
        />
        {/* Tu peux ajouter d'autres filtres ici plus tard (ex: select classe) */}
      </div>

      {/* Table */}
      {renderTable()}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Précédent
          </Button>

          <span className="text-sm text-muted-foreground px-4 py-2 bg-muted rounded">
            Page {currentPage} sur {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Suivant
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Modals */}
      {renderCreateUpdateModal()}
      {renderDeleteConfirmModal()}
    </div>
  );
}