import { create } from "zustand";
import type { Note, Category } from "@/types";
import * as api from "@/services/api";

interface NoteState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  filterCategory: Category | "All";
  searchQuery: string;
  loadNotes: () => Promise<void>;
  addNote: (payload: { title: string; content: string; category?: string; priority?: string }) => Promise<Note>;
  editNote: (id: number, payload: Partial<Note>) => Promise<void>;
  removeNote: (id: number) => Promise<void>;
  setFilter: (cat: Category | "All") => void;
  setSearch: (q: string) => void;
  filteredNotes: () => Note[];
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,
  filterCategory: "All",
  searchQuery: "",

  loadNotes: async () => {
    set({ loading: true, error: null });
    try {
      const notes = await api.fetchNotes();
      set({ notes, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addNote: async (payload) => {
    const note = await api.createNote(payload);
    set((s) => ({ notes: [note, ...s.notes] }));
    return note;
  },

  editNote: async (id, payload) => {
    const updated = await api.updateNote(id, payload);
    set((s) => ({ notes: s.notes.map((n) => (n.id === id ? updated : n)) }));
  },

  removeNote: async (id) => {
    await api.deleteNote(id);
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
  },

  setFilter: (cat) => set({ filterCategory: cat }),
  setSearch: (q) => set({ searchQuery: q }),

  filteredNotes: () => {
    const { notes, filterCategory, searchQuery } = get();
    let result = [...notes];
    if (filterCategory !== "All") result = result.filter((n) => n.category === filterCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime());
  },
}));