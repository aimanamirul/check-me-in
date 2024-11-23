import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { Note } from '../util/types';
import supabase from '../util/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  session: Session | null;
  setSession: (session: Session | null) => void;
  notes: Note[];
  fetchNotes: () => Promise<void>;
  isLoadingNotes: boolean;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchNotes = async () => {
    if (!session) {
      setNotes([]);
      return;
    }

    try {
      setIsLoadingNotes(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('author', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error fetching notes',
          description: error.message,
        });
        return;
      }

      setNotes(data || []);
    } catch (error) {
      toast({
        title: 'Error fetching notes',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoadingNotes(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [session]);

  const value = {
    isDarkMode,
    toggleDarkMode,
    session,
    setSession,
    notes,
    fetchNotes,
    isLoadingNotes,
    selectedDate,
    setSelectedDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}