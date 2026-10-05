"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import SuggestModal from "@/components/suggest/SuggestModal";

interface SuggestFilmButtonProps {
  groupId: string;
}

export default function SuggestFilmButton({ groupId }: SuggestFilmButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-gold hover:bg-gold-hover text-background text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      >
        Suggest a Film
      </button>

      {/* Portal to <body>: the navbar's backdrop-blur makes it the containing
          block for fixed descendants, which would trap the modal inside it. */}
      {open &&
        createPortal(
          <SuggestModal groupId={groupId} onClose={() => setOpen(false)} />,
          document.body
        )}
    </>
  );
}