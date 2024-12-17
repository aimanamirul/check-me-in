import React, { useState, useEffect } from 'react';
import { Agenda } from '@/util/types';
import { useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from 'react-dnd';

interface PlannerTimelineProps {
    agendas: Agenda[];
    isHorizontal: boolean;
}

interface DraggableAgendaProps {
    agenda: Agenda;
    isHorizontal: boolean;
    onDrop: (item: Agenda, monitor: DropTargetMonitor) => void;
}

export function PlannerTimeline({ agendas, isHorizontal }: PlannerTimelineProps) {
    const [updatedAgendas, setUpdatedAgendas] = useState(agendas);

    useEffect(() => {
        setUpdatedAgendas(agendas);
    }, [agendas]);

    const handleDrop = (item: Agenda, monitor: DropTargetMonitor) => {
        const delta = monitor.getDifferenceFromInitialOffset();
        const newTime = calculateNewTime(item.startTime, delta);
        const updatedAgenda = { ...item, startTime: newTime.startTime, endTime: newTime.endTime };
        setUpdatedAgendas(prevAgendas => prevAgendas.map(agenda => agenda.id === item.id ? updatedAgenda : agenda));
    };

    const calculateNewTime = (startTime: string, delta: { x: number; y: number }) => {
        // Logic to calculate new start and end time based on delta
        // ...existing code...
    };

    return (
        <div className={isHorizontal ? 'flex overflow-x-auto p-4' : 'block p-4'}>
            {updatedAgendas.map(agenda => (
                <DraggableAgenda key={agenda.id} agenda={agenda} isHorizontal={isHorizontal} onDrop={handleDrop} />
            ))}
        </div>
    );
}

const DraggableAgenda = ({ agenda, isHorizontal, onDrop }: DraggableAgendaProps) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'AGENDA',
        item: agenda,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'AGENDA',
        drop: (item: Agenda, monitor: DropTargetMonitor) => onDrop(item, monitor),
    });

    return (
        <div
            ref={node => drag(drop(node))}
            className={`hover:cursor-pointer p-4 border rounded shadow-sm ${isHorizontal ? 'mr-4' : 'mb-4'} ${isDragging ? 'opacity-50' : ''}`}
            style={{ backgroundColor: 'white', width: '200px' }}
        >
            <h3 className="font-bold text-lg">{agenda.title}</h3>
            <p className="text-sm text-gray-600">{agenda.description}</p>
            <p className="text-xs text-gray-500">{agenda.startTime} - {agenda.endTime}</p>
        </div>
    );
};
