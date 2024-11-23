import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox" // Assuming you have a Checkbox component

import { Todo } from '../../util/types'

// interface ListItem {
//   id: number;
//   text: string;
// }

// interface TodoItem extends ListItem {
//   completed: boolean
// }

interface ToDoListProps {
  items: Todo[]
  onToggle: (id: number) => void
  title?: string
}

export function ToDoList({ items, onToggle, title = "To-Do List" }: ToDoListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map(item => (
            <li key={item.id} className="flex items-center space-x-2">
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => onToggle(item.id)}
              />
              <span className={item.completed ? "line-through text-gray-500" : ""}>
                {item.todo_task}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}