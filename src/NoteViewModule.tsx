import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Note } from './util/types';

interface NoteViewModuleProps {
  notes: Note[];
}

export function NoteViewModule({ notes }: NoteViewModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < notes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <Card className="flex flex-col h-full min-h-72">
      {notes.length > 0 ? (
        <>
          <CardHeader>
            <CardTitle>{notes[currentIndex].title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto max-h-72">
            <p>{notes[currentIndex].text}</p>
          </CardContent>
          <div className="flex justify-between p-4">
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentIndex === notes.length - 1}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>No Notes</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto max-h-72">
            <p className="text-center text-gray-500">You haven't created any notes yet. Create a note to get started!</p>
          </CardContent>
        </>
      )}
    </Card>
  );
}
