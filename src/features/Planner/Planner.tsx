import { useState, ChangeEvent, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from '@/context/AppContext'
import { Agenda } from '@/util/types'
import { PlannerTimeline } from './PlannerTimeline'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function Planner() {
    const { selectedDate } = useApp();
    const [agendas, setAgendas] = useState<Agenda[]>(() => {
        const savedAgendas = localStorage.getItem('agendas');
        return savedAgendas ? JSON.parse(savedAgendas) : [];
    });
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isHorizontal, setIsHorizontal] = useState(false);

    const addAgenda = () => {
        const newAgenda: Agenda = {
            id: agendas.length + 1,
            title,
            description,
            startTime,
            endTime,
        };
        const updatedAgendas = [...agendas, newAgenda];
        setAgendas(updatedAgendas);
        localStorage.setItem('agendas', JSON.stringify(updatedAgendas));
        setTitle('');
        setDescription('');
        setStartTime('');
        setEndTime('');
    };

    useEffect(() => {
        localStorage.setItem('agendas', JSON.stringify(agendas));
    }, [agendas]);

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value);
    const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value);
    const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value);

    return (
        <Card className="flex flex-col min-h-[80dvh] md:h-full relative">
            <CardHeader>
                <CardTitle>Add New Agenda</CardTitle>
            </CardHeader>
            <div className="grid w-full items-center gap-4">
                <CardContent className="flex-grow flex flex-col space-y-4">
                    <Input value={title} onChange={handleTitleChange} placeholder="Title" className="mb-2" />
                    <Textarea value={description} onChange={handleDescriptionChange} placeholder="Description" className="mb-2" />
                    <div className="flex mb-2">
                        <label className="flex-1 mr-2">
                            Start Time
                            <Input type='time' value={startTime} onChange={handleStartTimeChange} />
                        </label>
                        <label className="flex-1">
                            End Time
                            <Input type='time' value={endTime} onChange={handleEndTimeChange} />
                        </label>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button onClick={addAgenda} className="mt-4">Add Agenda</Button>
                    <Button onClick={() => setIsHorizontal(!isHorizontal)} className="mt-4 ml-2">
                        Toggle {isHorizontal ? 'Vertical' : 'Horizontal'} View
                    </Button>
                </CardFooter>
            </div>
            <PlannerTimeline agendas={agendas} isHorizontal={isHorizontal} />
        </Card>
    )
}
