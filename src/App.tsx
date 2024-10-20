import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NoteModule } from './NoteModule'
import { TodoModule } from './ToDoModule'
import { ToDoList } from './ToDoList'
import { ListModule } from './NoteListModule'
import { Button } from "@/components/ui/button"
import { Moon, Sun, BookOpenText, List } from 'lucide-react'
import { LoginModule } from './LoginModule'
import { NoteViewModule } from './NoteViewModule'
export default function App() {
  const [activeTab, setActiveTab] = useState("notes")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const fetchData = async () => {
    try {
      // Simulating API call with dummy data
      const response = {
        ok: true,
        json: async () => ({
          notes: dummyNotes,
          todos: dummyTodos
        })
      };

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchData();
      if (result) {
        // Here you would typically update your state with the fetched data
        console.log('Fetched data:', result);
      }
    };

    loadData();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const [viewMode, setViewMode] = useState<'list' | 'individual'>('list');

  const dummyNotes = [
    { id: 1, title: "Grocery List", text: "Remember to buy groceries, including fruits, vegetables, dairy products, and any other essentials for the week.", date: "2023-10-01" },
    { id: 2, title: "Birthday Reminder", text: "Call mom on her birthday to wish her a happy birthday and ask her how she is doing.", date: "2023-10-02" },
    { id: 3, title: "Work Task", text: "Finish the project report by compiling all the necessary data and insights gathered over the past month.", date: "2023-10-03" },
    { id: 4, title: "Meeting Notes", text: "Discuss project timeline with the team, ensuring everyone is aligned on deadlines and responsibilities.", date: "2023-10-04" },
    { id: 5, title: "Book Recommendation", text: "Read 'The Pragmatic Programmer' to enhance coding skills and learn best practices in software development.", date: "2023-10-05" },
    { id: 6, title: "Workout Plan", text: "30 minutes of cardio followed by 20 minutes of strength training, focusing on major muscle groups for a balanced workout.", date: "2023-10-06" },
  ]

  const dummyTodos = [
    { id: 1, text: "Complete daily check-in", completed: false },
    { id: 2, text: "Review team's progress", completed: true },
    { id: 3, text: "Prepare for tomorrow's meeting", completed: false },
  ]

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
              {activeTab === "notes" && <NoteModule />}
              {activeTab === "todos" && <TodoModule />}
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
                <ListModule items={dummyNotes} />
              ) : (
                <NoteViewModule notes={dummyNotes} />
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
                <ToDoList items={dummyTodos} onToggle={() => {}} />
              </TabsContent>
            </Tabs>
            {!isLoggedIn && (
              <div className="mt-auto">
                <LoginModule onLogin={handleLogin} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
