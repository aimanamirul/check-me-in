import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { AgendaItem as AgendaItemType } from '@/util/types';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Edit } from 'lucide-react'

interface AgendaItemProps {
  item: AgendaItemType;
  isVertical: boolean;
  currentHour: number;
  onResizeItem: (id: string, endHour: number) => void;
  onRemoveItem: (id: string) => void;
  onEditItem: (item: AgendaItemType) => void;
}

const AgendaItem: React.FC<AgendaItemProps> = ({ item, isVertical, currentHour, onResizeItem, onRemoveItem, onEditItem }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [{ isDragging }, drag] = useDrag({
    type: 'agendaItem',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startEndHour = item.endHour;

    const doDrag = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const deltaHours = Math.round(deltaY / 100);
      const newEndHour = Math.max(item.startHour + 1, Math.min(24, startEndHour + deltaHours));
      onResizeItem(item.id, newEndHour);
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const handleRemoveClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmRemoveItem = () => {
    onRemoveItem(item.id);
    setShowDeleteConfirm(false);
  };

  const cancelRemoveItem = () => {
    setShowDeleteConfirm(false);
  };

  const isFirstHour = currentHour === item.startHour;
  const isLastHour = currentHour === item.endHour - 1;

  return (
    <Card
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        height: '100px',
        marginBottom: '8px',
        backgroundColor: item.color,
      }}
      className="relative cursor-move"
    >
      <CardContent className="p-2">
        {isFirstHour && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={handleRemoveClick}
            >
              <X className="h-4 w-4 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-10 h-6 w-6"
              onClick={() => onEditItem(item)}
            >
              <Edit className="h-4 w-4 text-white" />
            </Button>
          </>
        )}
        <h3 className="font-semibold pr-6">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {isFirstHour ? `Starts: ${item.startHour}:00` : ''}
          {isLastHour ? ` Ends: ${item.endHour}:00` : ''}
        </p>
      </CardContent>
      {showDeleteConfirm && (
        <div className="absolute top-8 right-1 bg-white p-2 rounded shadow-lg z-10">
          <p className="text-sm">Delete this item?</p>
          <div className="mt-2 flex justify-end space-x-2">
            <Button className="text-white" variant="ghost" size="sm" onClick={cancelRemoveItem}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={confirmRemoveItem}>Delete</Button>
          </div>
        </div>
      )}
      {isLastHour && isVertical && (
        <div
          className="absolute bottom-0 left-0 right-0 h-2 bg-primary/20 cursor-ns-resize"
          onMouseDown={handleResize}
        />
      )}
      {isLastHour && !isVertical && (
        <div
          className="absolute top-0 bottom-0 right-0 w-2 bg-primary/20 cursor-ew-resize"
          onMouseDown={handleResize}
        />
      )}
    </Card>
  );
};

export default AgendaItem;

