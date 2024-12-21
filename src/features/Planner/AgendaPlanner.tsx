import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PlannerTimeline from './PlannerTimeline';
import AgendaForm from './AgendaForm';
import { AgendaItem, StoredAgenda } from '@/util/types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useApp } from '@/context/AppContext'
import { formatDate } from '@/util/helpers';

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const AgendaPlanner: React.FC = () => {
  const { selectedDate } = useApp();
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isVertical, setIsVertical] = useState(true);

  useEffect(() => {
    console.log('?');

    const savedAgendas = localStorage.getItem('agendas');
    if (savedAgendas) {
      const parsedAgendas: StoredAgenda[] = JSON.parse(savedAgendas);
      const formattedDate = selectedDate.toLocaleDateString('en-GB'); // Format date to DD/MM/YYYY
      const currentAgenda = parsedAgendas.find(agenda => agenda.date === formattedDate);
      setAgendaItems(currentAgenda ? currentAgenda.agendaItems : []);
    }
  }, [selectedDate]);

  const saveAgendasToLocalStorage = (newAgendaItems: AgendaItem[]) => {
    const savedAgendas = localStorage.getItem('agendas');
    const parsedAgendas: StoredAgenda[] = savedAgendas ? JSON.parse(savedAgendas) : [];
    const formattedDate = selectedDate.toLocaleDateString('en-GB'); // Format date to DD/MM/YYYY
    const updatedAgendas = parsedAgendas.filter(agenda => agenda.date !== formattedDate);
    updatedAgendas.push({ date: formattedDate, agendaItems: newAgendaItems });
    localStorage.setItem('agendas', JSON.stringify(updatedAgendas));
  };

  const handleCreateAgendaItem = (newItem: AgendaItem) => {
    const updatedAgendaItems = [...agendaItems, { ...newItem, color: generateRandomColor() }];
    setAgendaItems(updatedAgendaItems);
    saveAgendasToLocalStorage(updatedAgendaItems);
  };

  const handleMoveItem = (id: string, newStartHour: number) => {
    const updatedAgendaItems = agendaItems.map(item => {
      if (item.id === id) {
        const duration = item.endHour - item.startHour;
        return { ...item, startHour: newStartHour, endHour: newStartHour + duration };
      }
      return item;
    });
    setAgendaItems(updatedAgendaItems);
    saveAgendasToLocalStorage(updatedAgendaItems);
  };

  const handleResizeItem = (id: string, newEndHour: number) => {
    const updatedAgendaItems = agendaItems.map(item =>
      item.id === id ? { ...item, endHour: newEndHour } : item
    );
    setAgendaItems(updatedAgendaItems);
    saveAgendasToLocalStorage(updatedAgendaItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedAgendaItems = agendaItems.filter(item => item.id !== id);
    setAgendaItems(updatedAgendaItems);
    saveAgendasToLocalStorage(updatedAgendaItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className={`w-full ${isVertical ? 'max-w-6xl' : ''} mx-auto`}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Agenda Planner for {formatDate(selectedDate)}</CardTitle>
            <Button
              variant="outline"
              onClick={() => setIsVertical(!isVertical)}
            >
              {isVertical ? 'Switch to Horizontal' : 'Switch to Vertical'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AgendaForm onCreateAgendaItem={handleCreateAgendaItem} />
          <PlannerTimeline
            agendaItems={agendaItems}
            isVertical={isVertical}
            onMoveItem={handleMoveItem}
            onResizeItem={handleResizeItem}
            onRemoveItem={handleRemoveItem}
          />
        </CardContent>
      </Card>
    </DndProvider>
  );
};

export default AgendaPlanner;

