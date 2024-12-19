import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PlannerTimeline from './PlannerTimeline';
import AgendaForm from './AgendaForm';
import { AgendaItem } from '@/util/types';
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

  const handleCreateAgendaItem = (newItem: AgendaItem) => {
    setAgendaItems([...agendaItems, { ...newItem, color: generateRandomColor() }]);
  };

  const handleMoveItem = (id: string, newStartHour: number) => {
    setAgendaItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const duration = item.endHour - item.startHour;
          return { ...item, startHour: newStartHour, endHour: newStartHour + duration };
        }
        return item;
      })
    );
  };

  const handleResizeItem = (id: string, newEndHour: number) => {
    setAgendaItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, endHour: newEndHour } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setAgendaItems(prevItems => prevItems.filter(item => item.id !== id));
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

