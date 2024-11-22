import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Note } from '../../util/types';
import { PencilIcon, TrashIcon } from 'lucide-react';
import supabase from '../../util/supabaseClient';
import { Toaster } from "@/components/ui/toaster"
import { Spinner } from '@/components/spinner'
import { useToast } from '@/hooks/use-toast'

interface NoteViewModuleProps {
  notes: Note[];
  onNoteUpdated: () => void;
}

export function NoteViewer({ notes, onNoteUpdated }: NoteViewModuleProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
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

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        toast({
          title: 'Error',
          description: 'Please login to delete notes.',
        });
        return;
      }

      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', notes[currentIndex].id)
        .eq('author', userData.user.id);

      if (deleteError) {
        toast({
          title: 'Error deleting note',
          description: deleteError.message,
        });
        return;
      }

      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });

      onNoteUpdated();

      // Update local state
      if (currentIndex === notes.length - 1) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full min-h-72 relative">
      {notes.length > 0 ? (
        <>
          <CardHeader className="flex justify-between flex-row">
            <CardTitle>{notes[currentIndex].title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto max-h-72">
            <p className="flex-grow whitespace-pre-wrap">{notes[currentIndex].text}</p>
            <div className="flex gap-2 mt-4">
              <Button variant="ghost" size="icon" className="text-gray-100 dark:text-gray-100">
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-100 dark:text-gray-100" onClick={handleDelete}>
                <TrashIcon className="h-4 w-4" /> 
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4">
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentIndex === notes.length - 1}>
              Next
            </Button>
          </CardFooter>
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
      <Toaster />
      {isLoading && <Spinner />}
    </Card>
  );
}
