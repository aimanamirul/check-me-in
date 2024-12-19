import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from 'lucide-react'

import { Todo } from '../../util/types'
import { useApp } from '@/context/AppContext'

import supabase from '../../util/supabaseClient';

import { formatDate } from '@/util/helpers'; // Import the helper function

import { Spinner } from '@/components/spinner';

export function ToDo() {
  const { selectedDate, session } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState<Todo>({ id: null as unknown as number, todo_task: '', todo_date: new Date(), completed: false })

  useEffect(() => {
    if (!session) return;

    console.log('fetching todos for date - ' + selectedDate)
    // Fetch todos from the database based on the selected date
    const fetchTodos = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('todo')
        .select()
        .eq('author', session.user.id)
        .eq('todo_date', selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] : null);
      if (error) {
        console.error('Error fetching todos:', error);
      } else {
        setTodos(data);
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [selectedDate, session]);

  const addTodo = async () => {
    if (!session) return;

    if (newTodo.todo_task.trim() !== '') {
      const newTodoItem = { todo_task: newTodo.todo_task, todo_date: selectedDate, completed: false };

      // Save the new todo to Supabase
      const { data, error } = await supabase
        .from('todo')
        .insert([{
          todo_task: newTodoItem.todo_task,
          todo_date: selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] : null,
          completed: newTodoItem.completed,
          author: session.user.id
        }])
        .select();

      if (error) {
        console.error('Error saving todo:', error);
      } else {
        const insertedTodo = data[0];
        setTodos([...todos, insertedTodo]);
        setNewTodo({ id: null as unknown as number, todo_task: '', todo_date: new Date(), completed: false });
      }
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    // Optionally, update the todo status in the database here
  }

  const removeTodo = async (id: number) => {
    if (!session) return;

    setIsLoading(true);
    // Optionally, remove the todo from the database here
    const { error } = await supabase
      .from('todo')
      .delete()
      .eq('id', id)
      .eq('author', session.user.id);

    if (error) {
      console.error('Error removing todo:', error);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
    setIsLoading(false);
  }

  

  return (
    <Card>
      <CardHeader>
        <CardTitle>To-Do List for {formatDate(selectedDate)}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTodo.todo_task}
            onChange={(e) => setNewTodo({ ...newTodo, todo_task: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <Button onClick={addTodo}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center space-x-2">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <span className={todo.completed ? 'line-through' : ''}>{todo.todo_task}</span>
              <Button variant="ghost" size="sm" className="text-gray-100 dark:text-gray-100" onClick={() => removeTodo(todo.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
        {isLoading && <Spinner text="Loading todos..." />}
      </CardContent>
    </Card>
  )
}