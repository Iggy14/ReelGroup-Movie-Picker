"use client";

import { useState } from "react";
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

      {open && <SuggestModal groupId={groupId} onClose={() => setOpen(false)} />}
    </>
  );
}