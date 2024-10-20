import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Cat } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import '@/styles/cat.css'

export function NoteModule() {
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [showMeow, setShowMeow] = useState(false)

  const handleSave = () => {
    console.log('Saving note:', { title: noteTitle, content: noteContent })
    // Implement actual save functionality here
  }

  const handleMeow = () => {
    setShowMeow(true)
    setTimeout(() => setShowMeow(false), 150)
    setNoteContent(prevContent => prevContent + ' meow')
  }

  useEffect(() => {
    const shakeButton = () => {
      const button = document.querySelector('.meow-button')
      if (button) {
        button.classList.add('shaking')
        setTimeout(() => button.classList.remove('shaking'), 500)
      }
    }

    const initialDelay = Math.random() * 30000
    const shakeInterval = setInterval(shakeButton, 30000)

    const initialShakeTimeout = setTimeout(() => {
      shakeButton()
    }, initialDelay)

    return () => {
      clearInterval(shakeInterval)
      clearTimeout(initialShakeTimeout)
    }
  }, [])

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
      <CardFooter className="flex justify-between">
        <Button onClick={handleSave} className="dark:bg-sky-950 dark:hover:bg-sky-700 dark:text-white">
          <Save className="mr-2 h-4 w-4" /> Save Note
        </Button>
        <div className="relative">
          <Button
            className="meow-button"
            title="When in doubt, meow!"
            onClick={handleMeow}
          >
            <Cat className="h-4 w-4" />
          </Button>
          <AnimatePresence>
            {showMeow && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: -20 }}
                exit={{ opacity: 0, y: -40 }}
                className="absolute top-0 right-0 transform -translate-y-full"
              >
                <span className="text-lg font-bold">Meow!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardFooter>
    </Card>
  )
}