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
import supabase from '@/util/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const AgendaPlanner: React.FC = () => {
  const { selectedDate, session } = useApp();
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isVertical, setIsVertical] = useState(true);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    const fetchAgendas = async () => {
      if (!session) {
        const savedAgendas = localStorage.getItem('agendas');
        if (savedAgendas) {
          const parsedAgendas: StoredAgenda[] = JSON.parse(savedAgendas);
          const formattedDate = selectedDate.toLocaleDateString('en-GB'); // Format date to DD/MM/YYYY
          const currentAgenda = parsedAgendas.find(agenda => agenda.date === formattedDate);
          setAgendaItems(currentAgenda ? currentAgenda.agendaItems : []);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('agendas')
          .select('*')
          .eq('date', selectedDate.toLocaleDateString('en-GB'))
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error fetching agendas:', error);
          return;
        }

        setAgendaItems(data.length ? data[0].agendaItems : []);
      } catch (error) {
        console.error('Error fetching agendas:', error);
      }
    };

    fetchAgendas();
  }, [selectedDate, session]);

  const saveAgendasToLocalStorage = (newAgendaItems: AgendaItem[]) => {
    const savedAgendas = localStorage.getItem('agendas');
    const parsedAgendas: StoredAgenda[] = savedAgendas ? JSON.parse(savedAgendas) : [];
    const formattedDate = selectedDate.toLocaleDateString('en-GB'); // Format date to DD/MM/YYYY
    const updatedAgendas = parsedAgendas.filter(agenda => agenda.date !== formattedDate);
    updatedAgendas.push({ date: formattedDate, agendaItems: newAgendaItems });
    localStorage.setItem('agendas', JSON.stringify(updatedAgendas));
  };

  const saveAgendasToSupabase = async (newAgendaItems: AgendaItem[]) => {
    if (!session) return;

    try {
      const { error } = await supabase
        .from('agendas')
        .upsert({
          date: selectedDate.toLocaleDateString('en-GB'),
          user_id: session.user.id,
          agendaItems: newAgendaItems,
        });

      if (error) {
        console.error('Error saving agendas:', error);
      }
    } catch (error) {
      console.error('Error saving agendas:', error);
    }
  };

  const handleCreateAgendaItem = (newItem: AgendaItem) => {
    const updatedAgendaItems = [...agendaItems, { ...newItem, color: generateRandomColor() }];
    setAgendaItems(updatedAgendaItems);
    saveAgendasToLocalStorage(updatedAgendaItems);
    saveAgendasToSupabase(updatedAgendaItems);
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
    saveAgendasToSupabase(updatedAgendaItems);
  };

  const handleResizeItem = (id: string, newEndHour: number) => {
    const updatedAgendaItems = agendaItems.map(item =>
      item.id === id ? { ...item, endHour: newEndHour } : item
    );
    setAgendaItems(updatedAgendaItems);
    saveAgendasToLocalStorage(updatedAgendaItems);
    saveAgendasToSupabase(updatedAgendaItems);
  };

  const handleRemoveItem = (id: string) => {
    const updatedAgendaItems = agendaItems.filter(item => item.id !== id);
    setAgendaItems(updatedAgendaItems);
    saveAgendasToLocalStorage(updatedAgendaItems);
    saveAgendasToSupabase(updatedAgendaItems);
  };

  const handleEditItem = (item: AgendaItem) => {
    setEditingItem(item);
    setFormMode('edit');
  };

  const handleUpdateAgendaItem = (updatedItem: AgendaItem) => {
    const updatedAgendaItems = agendaItems.map(item => 
      item.id === updatedItem.id ? { ...item, ...updatedItem } : item
    );
    setAgendaItems(updatedAgendaItems);
    saveAgendasToLocalStorage(updatedAgendaItems);
    saveAgendasToSupabase(updatedAgendaItems);
    setEditingItem(null);
    setFormMode('add');
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
          <AgendaForm
            mode={formMode}
            initialData={formMode === 'edit' && editingItem ? editingItem : undefined}
            onCreateAgendaItem={formMode === 'add' ? handleCreateAgendaItem : handleUpdateAgendaItem}
          />
          <PlannerTimeline
            agendaItems={agendaItems}
            isVertical={isVertical}
            onMoveItem={handleMoveItem}
            onResizeItem={handleResizeItem}
            onRemoveItem={handleRemoveItem}
            onEditItem={handleEditItem}
          />
        </CardContent>
      </Card>
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={() => { setEditingItem(null); setFormMode('add'); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Agenda Item</DialogTitle>
            </DialogHeader>
            <AgendaForm
              mode="edit"
              initialData={editingItem}
              onCreateAgendaItem={handleUpdateAgendaItem}
            />
          </DialogContent>
        </Dialog>
      )}
    </DndProvider>
  );
};

export default AgendaPlanner;

