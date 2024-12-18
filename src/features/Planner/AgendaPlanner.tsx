import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PlannerTimeline from './PlannerTimeline';
import AgendaForm from './AgendaForm';
import { Agenda } from '../../util/types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button";

const AgendaPlanner: React.FC = () => {
  const [agendaItems, setAgendaItems] = useState<Agenda[]>([]);
  const [isVertical, setIsVertical] = useState(true);

  const handleCreateAgendaItem = (newItem: Agenda) => {
    setAgendaItems([...agendaItems, newItem]);
  };

  const moveAgendaItem = (dragIndex: number, hoverIndex: number) => {
    const newAgendaItems = Array.from(agendaItems);
    const [movedItem] = newAgendaItems.splice(dragIndex, 1);
    newAgendaItems.splice(hoverIndex, 0, movedItem);
    setAgendaItems(newAgendaItems);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Agenda Planner</CardTitle>
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
        <DndProvider backend={HTML5Backend}>
          <PlannerTimeline agendaItems={agendaItems} isVertical={isVertical} />
        </DndProvider>
      </CardContent>
    </Card>
  );
};

export default AgendaPlanner;
