import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ListItem {
  id: number
  text: string
  title?: string
}

interface ListModuleProps {
  items: ListItem[]
}

export function ListModule({ items }: ListModuleProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id}>
          <CardHeader
            className="cursor-pointer flex flex-row items-center justify-between"
            onClick={() => toggleItem(item.id)}
          >
            <CardTitle>{item.title || 'Untitled'}</CardTitle>
            <motion.div
              initial={false}
              animate={{ rotate: expandedItems.includes(item.id) ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-4 w-4" />
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
                <CardContent>
                  <p>{item.text}</p>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}
    </div>
  )
}
