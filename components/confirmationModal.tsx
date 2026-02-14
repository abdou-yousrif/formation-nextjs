// components/ConfirmationModal.tsx
"use client";

import { Button } from "../components/ui/button";

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({ title, message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-background backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}