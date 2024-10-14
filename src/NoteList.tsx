import { ListModule } from './ListModule'
// import { ListItem } from './ListModule' // Assuming ListItem is exported from ListModule

interface Note {
  id: number;
  text: string;
}

interface NoteListProps {
  notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
  return (
    <ListModule items={notes.map(note => ({ id: note.id, text: note.text }))} />
  );
}
