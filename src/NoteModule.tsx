import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Sun } from 'lucide-react'

export function NoteModule() {
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')

  const handleSave = () => {
    // Here you would typically save the note to a backend or local storage
    console.log('Saving note:', { title: noteTitle, content: noteContent })
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Daily Note</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col space-y-4">
        <Input
          placeholder="Enter note title..."
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <Textarea
          placeholder="Write your daily note here..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="flex-grow resize-none"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white">
          <Save className="mr-2 h-4 w-4" /> Save Note
        </Button>
      </CardFooter>
    </Card>
  )
}