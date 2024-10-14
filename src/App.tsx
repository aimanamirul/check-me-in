import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NoteModule } from './NoteModule'
import { TodoModule } from './ToDoModule'
import { ToDoList } from './ToDoList'
import { ListModule } from './ListModule'
import { Button } from "@/components/ui/button"
import { Moon, Sun, Save } from 'lucide-react'

export default function App() {
  const [activeTab, setActiveTab] = useState("notes")
  const [isDarkMode, setIsDarkMode] = useState(false)

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

  const dummyNotes = [
    { id: 1, title: "Grocery List", text: "Remember to buy groceries" },
    { id: 2, title: "Birthday Reminder", text: "Call mom on her birthday" },
    { id: 3, title: "Work Task", text: "Finish the project report" },
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

          <div className="lg:col-span-4 p-4 min-h-screen">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="todos">To-Do List</TabsTrigger>
              </TabsList>
              <TabsContent value="notes">
                <h2 className="text-xl font-semibold mb-4">Notes</h2>
                <ListModule items={dummyNotes} />
              </TabsContent>
              <TabsContent value="todos">
                <h2 className="text-xl font-semibold mb-4">To-Do List</h2>
                <ToDoList items={dummyTodos as TodoItem[]} onToggle={() => {}} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}