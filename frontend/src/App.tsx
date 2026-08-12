import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ToastContainer } from "@/components/Toast";
import { NoteModal } from "@/components/NoteModal";
import { Dashboard } from "@/pages/Dashboard";
import { Notes } from "@/pages/Notes";
import { MLLab } from "@/pages/MLLab";
import { Database } from "@/pages/Database";
import { Architecture } from "@/pages/Architecture";
import { PythonBackend } from "@/pages/PythonBackend";
import { useNoteStore } from "@/store/useNoteStore";
import type { Note } from "@/types";

const PAGES: Record<string, React.FC<any>> = {
  dashboard: Dashboard,
  notes: Notes,
  mllab: MLLab,
  database: Database,
  architecture: Architecture,
  python: PythonBackend,
};

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalNote, setModalNote] = useState<Note | null | "new">(null);
  const loadNotes = useNoteStore((s) => s.loadNotes);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const PageComponent = PAGES[page] || Dashboard;

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar
        currentPage={page}
        onNavigate={setPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <PageComponent
          onNewNote={() => setModalNote("new")}
          onEditNote={(note: Note) => setModalNote(note)}
          onMenuToggle={() => setSidebarOpen(true)}
        />
      </div>
      <ToastContainer />
      {modalNote !== null && (
        <NoteModal
          note={modalNote === "new" ? null : modalNote}
          onClose={() => setModalNote(null)}
        />
      )}
    </div>
  );
}