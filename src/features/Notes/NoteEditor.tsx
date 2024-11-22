import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Cat } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../../components/ui/form';
import { useForm } from 'react-hook-form';
import { noteSchema } from '@/util/types'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from '@/hooks/use-toast'
import '@/styles/cat.css'

import { Spinner } from '@/components/spinner';

import supabase from '../../util/supabaseClient';

export function NoteEditor({ onNoteUpdated }: { onNoteUpdated: () => void }) {
  const [showMeow, setShowMeow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast();
  const form = useForm<z.infer<typeof noteSchema>>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      text: '',
    },
  });

  async function onSubmit(data: z.infer<typeof noteSchema>) {
    try {
      setIsLoading(true);

      //check if user is logged in
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        toast({
          title: 'Error getting user!',
          description: 'Please login to save your note.',
        })
      } else {
        console.log(userData);
        const { data: noteData, error: noteError } = await supabase.from('notes').insert({
          title: data.title,
          text: data.text,
        })

        if (noteError) {
          toast({
            title: 'Error saving note',
            description: noteError.message,
          })
        } else {
          console.log(noteData);
          toast({
            title: 'Note saved successfully',
            description: 'Your note has been saved!',
          })
          onNoteUpdated();
          form.reset();
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error saving note',
        description: error.message,
      })
    } finally {
      setIsLoading(false);
    }
  }

  const handleMeow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowMeow(true);
    setTimeout(() => setShowMeow(false), 150);
    const currentText = form.getValues('text') || '';
    form.setValue('text', currentText + ' meow');
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
    <Card className="flex flex-col min-h-[80dvh] md:h-full relative">
      <CardHeader>
        <CardTitle>Daily Note</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-center gap-4">
          <CardContent className="flex-grow flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter note title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField

              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write your daily note here..."
                      {...field}
                      className="flex-grow resize-none min-h-[60vh]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" className="dark:bg-sky-950 dark:hover:bg-sky-700 dark:text-white">
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
        </form>
      </Form>
      {isLoading && <Spinner />}
      <Toaster />
    </Card>
  )
}