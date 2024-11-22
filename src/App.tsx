import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NoteEditor } from './features/Notes/NoteEditor'
import { ToDo } from './features/ToDo/ToDo'
import { ToDoList } from './features/ToDo/ToDoList'
import { NoteList } from './features/Notes/NoteList'
import { Button } from "@/components/ui/button"
import { Moon, Sun, BookOpenText, List } from 'lucide-react'
import { LoginModule } from './features/User/LoginModule'
import { NoteViewer } from './features/Notes/NoteViewer'
import { Registration } from './features/User/Registration'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import supabase from './util/supabaseClient'
import { Session } from '@supabase/supabase-js'
import { UserModule } from './features/User/UserModule'
import { Spinner } from '@/components/spinner'
import { Note } from './util/types'

if (!supabase) {
  console.error('Error! Supabase client could not be created!');
}

export default function App() {
  const [activeTab, setActiveTab] = useState("notes")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [authTab, setAuthTab] = useState("login")
  const { toast } = useToast();

  // ================================================
  //          DARK MODE FUNCTIONALITY
  // ================================================

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])


  // ================================================
  //          LOGIN/LOGOUT FUNCTIONALITY
  // ================================================

  const handleLogin = (session: Session | null) => {
    console.log("Logging in");
    setSession(session);
  }

  const handleLogout = () => {
    setSession(null);
  }

  // ================================================
  //           VIEW MODE FUNCTIONALITY
  // ================================================

  const [viewMode, setViewMode] = useState<'list' | 'individual'>('list');

  // ================================================
  //           DATA RETRIEVAL
  // ================================================

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, [session]);

  const todosList = [
    { id: 1, text: "Complete daily check-in", completed: false },
    { id: 2, text: "Review team's progress", completed: true },
    { id: 3, text: "Prepare for tomorrow's meeting", completed: false },
  ]

  const handleRegistrationSuccess = () => {
    setAuthTab("login");
    toast({
      title: "Registration successful!",
      description: "You can now save your check-ins.",
    });
    fetchNotes();
  };

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

  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen font-poppins">
      <div className="w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 p-4 min-h-screen flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Daily Check-In</h1>
              <Button onClick={toggleDarkMode} variant="outline">
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex-grow overflow-auto">
              {activeTab === "notes" && <NoteEditor onNoteUpdated={fetchNotes} />}
              {activeTab === "todos" && <ToDo />}
            </div>
          </div>

          <div className="lg:col-span-4 p-4 min-h-screen flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-grow">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="notes" className="text-gray-700 data-[state=inactive]:text-gray-300">Notes</TabsTrigger>
                <TabsTrigger value="todos" className="text-gray-700 data-[state=inactive]:text-gray-300">To-Do List</TabsTrigger>
              </TabsList>
              <TabsContent value="notes">
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                {/* <ListModule items={dummyNotes} /> */}
                {viewMode === 'list' ? (
                  <NoteList items={notes} />
                ) : (
                  <NoteViewer notes={notes} onNoteUpdated={fetchNotes} />
                )}
                <div className="flex space-x-4 my-4">
                  <Button onClick={() => setViewMode('list')} variant={viewMode === 'list' ? 'default' : 'outline'}>
                    <List className={`h-4 w-4 ${viewMode === 'list' ? (isDarkMode ? 'text-gray-700' : 'text-white') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                  </Button>
                  <Button onClick={() => setViewMode('individual')} variant={viewMode === 'individual' ? 'default' : 'outline'}>
                    <BookOpenText className={`h-4 w-4 ${viewMode === 'individual' ? (isDarkMode ? 'text-gray-700' : 'text-white') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`} />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="todos">
                <h2 className="text-xl font-semibold mb-4">To-Do List</h2>
                <ToDoList items={todosList} onToggle={() => { }} />
              </TabsContent>
            </Tabs>

            {!session && (
              <Tabs value={authTab} onValueChange={setAuthTab} className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="text-gray-700 data-[state=inactive]:text-gray-300">Login</TabsTrigger>
                  <TabsTrigger value="register" className="text-gray-700 data-[state=inactive]:text-gray-300">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginModule onLogin={(session) => handleLogin(session)} />
                </TabsContent>
                <TabsContent value="register">
                  <Registration onRegistrationSuccess={handleRegistrationSuccess} />
                </TabsContent>
              </Tabs>
            )}
            {session && <UserModule session={session} onLogout={() => handleLogout()} />}
            <Toaster />
          </div>
        </div>
      </div>
      {isLoadingNotes && <Spinner text="Loading notes..." />}
    </div>
  )
}
