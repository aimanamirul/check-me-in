import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings } from 'lucide-react'
import { GradeScale } from '@/util/gpaCalculations'
import { Separator } from "@/components/ui/separator"

interface GradeScaleDialogProps {
  gradeScale: GradeScale
  setGradeScale: (scale: GradeScale) => void
}

export function GradeScaleDialog({ gradeScale, setGradeScale }: GradeScaleDialogProps) {
  const [newGrade, setNewGrade] = useState({ letter: '', points: 0 })
  const [editingGrade, setEditingGrade] = useState<string | null>(null)

  const addGradeToScale = () => {
    if (newGrade.letter && newGrade.points) {
      setGradeScale({ ...gradeScale, [newGrade.letter]: newGrade.points })
      setNewGrade({ letter: '', points: 0 })
    }
  }

  const removeGradeFromScale = (grade: string) => {
    const newScale = { ...gradeScale }
    delete newScale[grade]
    setGradeScale(newScale)
  }

  const startEditingGrade = (grade: string) => {
    setEditingGrade(grade)
    setNewGrade({ letter: grade, points: gradeScale[grade] })
  }

  const saveEditedGrade = () => {
    if (editingGrade && newGrade.letter && newGrade.points) {
      const newScale = { ...gradeScale }
      delete newScale[editingGrade]
      newScale[newGrade.letter] = newGrade.points
      setGradeScale(newScale)
      setEditingGrade(null)
      setNewGrade({ letter: '', points: 0 })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open grade scale settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Grade Scale Settings</DialogTitle>
          <DialogDescription>
            Customize your grade scale here. Add, edit, or remove grades as needed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="gradeLetter">Grade Letter</Label>
            <Input
              id="gradeLetter"
              value={newGrade.letter}
              onChange={(e) => setNewGrade({ ...newGrade, letter: e.target.value })}
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="gradePoints">Grade Points</Label>
            <Input
              id="gradePoints"
              type="number"
              value={newGrade.points}
              onChange={(e) => setNewGrade({ ...newGrade, points: Number(e.target.value) })}
              className="col-span-2"
            />
          </div>
          <Button onClick={editingGrade ? saveEditedGrade : addGradeToScale}>
            {editingGrade ? 'Save Grade' : 'Add Grade'}
          </Button>
        </div>
        <Separator />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Grade</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(gradeScale).map(([grade, points]) => (
              <TableRow key={grade}>
                <TableCell>{grade}</TableCell>
                <TableCell>{points}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => startEditingGrade(grade)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => removeGradeFromScale(grade)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

