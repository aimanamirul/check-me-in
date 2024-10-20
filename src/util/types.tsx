export interface Note {
  id: number;
  title?: string;
  text: string;
  date?: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
