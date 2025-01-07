import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { calculateGPA, calculateCGPA, Course, GradeScale, Semester } from '@/util/gpaCalculations'
import { GradeScaleDialog } from './GradeScaleDialog'
import { v4 as uuidv4 } from 'uuid'
import { TrashIcon } from 'lucide-react' // Add this import

const getRandomColor = () => {
    const letters = '89ABCDEF'; // Restrict to lighter colors for better contrast
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
}

export default function GpaCalculator() {
    const [semesters, setSemesters] = useState<Semester[]>([])
    const [newSemester, setNewSemester] = useState<string>('')
    const [gradeScale, setGradeScale] = useState<GradeScale>({
        'A': 4.0,
        'A-': 3.75, 
        'B+': 3.50, 
        'B': 3.0, 
        'B-': 2.75, 
        'C+': 2.5,
        'C': 2.0, 
        'D': 1.0, 
        'F': 0.0
    })

    const gradeOptions = Object.keys(gradeScale);
    const [newCourse, setNewCourse] = useState<Course>({ id: '', name: '', credits: 0, grade: gradeOptions[0] })

    useEffect(() => {
        const savedSemesters = localStorage.getItem('semesters');
        if (savedSemesters) {
            console.log(savedSemesters)
            setSemesters(JSON.parse(savedSemesters));
        }
    }, []); // Add an empty dependency array here

    const addSemester = () => {
        if (newSemester) {
            const updatedSemesters = [...semesters, { id: uuidv4(), name: newSemester, courses: [], color: getRandomColor() }];
            setSemesters(updatedSemesters);
            localStorage.setItem('semesters', JSON.stringify(updatedSemesters)); // Save to local storage
            setNewSemester('');
        }
    }

    const addCourse = (semesterId: string) => {
        if (newCourse.name && newCourse.credits && newCourse.grade) {
            const updatedSemesters = semesters.map(semester =>
                semester.id === semesterId
                    ? { ...semester, courses: [...semester.courses, { ...newCourse, id: uuidv4() }] }
                    : semester
            );
            setSemesters(updatedSemesters);
            localStorage.setItem('semesters', JSON.stringify(updatedSemesters)); // Save to local storage
            setNewCourse({ id: '', name: '', credits: 0, grade: gradeOptions[0] });
        }
    }

    const removeCourse = (semesterId: string, courseId: string) => {
        const updatedSemesters = semesters.map(semester =>
            semester.id === semesterId
                ? { ...semester, courses: semester.courses.filter(course => course.id !== courseId) }
                : semester
        );
        setSemesters(updatedSemesters);
        localStorage.setItem('semesters', JSON.stringify(updatedSemesters)); // Save to local storage
    }

    const updateCourseGrade = (semesterId: string, courseId: string, newGrade: string) => {
        setSemesters(semesters.map(semester =>
            semester.id === semesterId
                ? {
                    ...semester,
                    courses: semester.courses.map(course =>
                        course.id === courseId ? { ...course, grade: newGrade } : course
                    )
                }
                : semester
        ));
    }

    const deleteSemester = (semesterId: string) => {
        setSemesters(semesters.filter(semester => semester.id !== semesterId));
    }

    const cgpa = calculateCGPA(semesters, gradeScale)

    return (
        <div className="container mx-auto p-4 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-2xl font-bold">GPA/CGPA Calculator</CardTitle>
                    <GradeScaleDialog gradeScale={gradeScale} setGradeScale={setGradeScale} />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="semesterName">Semester Name</Label>
                                <Input
                                    id="semesterName"
                                    value={newSemester}
                                    onChange={(e) => setNewSemester(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button onClick={addSemester}>Add Semester</Button>
                            </div>
                        </div>

                        <Accordion type="single" collapsible className="w-full">
                            {semesters.map((semester) => (
                                <AccordionItem value={semester.id} key={semester.id}>
                                    <AccordionTrigger style={{ backgroundColor: semester.color }}>
                                        <div className="flex justify-between items-center w-full">
                                            {semester.name}
                                            <TrashIcon className="h-5 w-5 text-red-500" onClick={(e: React.MouseEvent<SVGSVGElement>) => { e.stopPropagation(); deleteSemester(semester.id); }} />
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-4 gap-4">
                                                <div>
                                                    <Label htmlFor={`courseName-${semester.id}`}>Course Name</Label>
                                                    <Input
                                                        id={`courseName-${semester.id}`}
                                                        value={newCourse.name}
                                                        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`credits-${semester.id}`}>Credits</Label>
                                                    <Input
                                                        id={`credits-${semester.id}`}
                                                        type="number"
                                                        value={newCourse.credits}
                                                        onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`grade-${semester.id}`}>Grade</Label>
                                                    <select
                                                        id={`grade-${semester.id}`}
                                                        value={newCourse.grade}
                                                        onChange={(e) => setNewCourse({ ...newCourse, grade: e.target.value })}
                                                        className="form-select block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    >
                                                        {gradeOptions.map((grade) => (
                                                            <option key={grade} value={grade}>
                                                                {grade}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex items-end">
                                                    <Button onClick={() => addCourse(semester.id)}>Add Course</Button>
                                                </div>
                                            </div>

                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Course Name</TableHead>
                                                        <TableHead>Credits</TableHead>
                                                        <TableHead>Grade</TableHead>
                                                        <TableHead>Action</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {semester.courses.map((course) => (
                                                        <TableRow key={course.id}>
                                                            <TableCell>{course.name}</TableCell>
                                                            <TableCell>{course.credits}</TableCell>
                                                            <TableCell>
                                                                <select
                                                                    value={course.grade}
                                                                    onChange={(e) => updateCourseGrade(semester.id, course.id, e.target.value)}
                                                                    className="form-select block w-full px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                                >
                                                                    {gradeOptions.map((grade) => (
                                                                        <option key={grade} value={grade}>
                                                                            {grade}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Button variant="destructive" onClick={() => removeCourse(semester.id, course.id)}>Remove</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>

                                            <div className="text-xl font-bold">
                                                Semester GPA: {calculateGPA(semester.courses, gradeScale).toFixed(2)}
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        <div className="text-2xl font-bold">
                            Cumulative GPA: {cgpa.toFixed(2)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
