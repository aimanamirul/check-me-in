import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from '@/context/AppContext'
import { Agenda } from '@/util/types'

export function Planner() {
    const { selectedDate } = useApp();
    const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const addAgenda = () => {
        const newAgenda: Agenda = {
            id: agendas.length + 1,
            title,
            description,
            startTime,
            endTime,
        };
        setAgendas([...agendas, newAgenda]);
        setTitle('');
        setDescription('');
        setStartTime('');
        setEndTime('');
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Add New Agenda</h2>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <Input value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="Start Time" />
            <Input value={endTime} onChange={(e) => setEndTime(e.target.value)} placeholder="End Time" />
            <Button onClick={addAgenda} className="mt-4">Add Agenda</Button>
            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4">Agendas</h2>
                {agendas.map(agenda => (
                    <div key={agenda.id} className="mb-2">
                        <h3 className="font-bold">{agenda.title}</h3>
                        <p>{agenda.description}</p>
                        <p>{agenda.startTime} - {agenda.endTime}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
