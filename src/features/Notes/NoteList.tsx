import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Note } from '../../util/types'

interface ListModuleProps {
  items: Note[]
}

export function NoteList({ items }: ListModuleProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    )
  }

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    event.preventDefault();
    container.scrollBy({
      top: event.deltaY > 0 ? 100 : -100,
      behavior: 'smooth'
    });
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-72 scroll-smooth" onWheel={handleWheel}>
      {items.length > 0 ? (
        items.map(item => (
          <Card key={item.id} className="transition-shadow hover:shadow-lg dark:bg-gray-800">
            <CardHeader
              className="cursor-pointer flex items-center justify-between p-4 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-sky-950 dark:hover:bg-sky-800"
              onClick={() => toggleItem(item.id)}
            >
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item.title || 'Untitled'}</CardTitle>
              <motion.div
                initial={false}
                animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <ChevronDown className="h-4 w-4 text-gray-900 dark:text-gray-100" />
              </motion.div>
            </CardHeader>
            <AnimatePresence>
              {expandedItems.includes(item.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">{item.text}</p>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))
      ) : (
        <Card className="h-full min-h-72">
          <CardHeader>
            <CardTitle>No Notes</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto max-h-72">
            <p className="text-center text-gray-500">You haven't created any notes yet. Create a note to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
