import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Agenda } from '../../util/types';
import { Card, CardContent } from "@/components/ui/card";

interface AgendaItemProps {
  item: Agenda;
  index: number;
  isVertical: boolean;
  currentHour: number;
}

const AgendaItem: React.FC<AgendaItemProps> = ({ item, index, isVertical, currentHour }) => {
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(180);

  useEffect(() => {
    const startHour = parseInt(item.startTime.split(':')[0]);
    const endHour = parseInt(item.endTime.split(':')[0]);
    const duration = endHour - startHour;
    setHeight(duration * 100);
    setWidth(duration * 180);
  }, [item.startTime, item.endTime]);

  const handleResize = (e: React.MouseEvent, direction: 'height' | 'width') => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startHeight = height;
    const startWidth = width;

    const doDrag = (e: MouseEvent) => {
      const startHour = parseInt(item.startTime.split(':')[0]);
      if (direction === 'height') {
        const newHeight = startHeight + e.clientY - startY;
        setHeight(Math.max(100, newHeight));
        const newEndHour = startHour + Math.max(1, Math.round(newHeight / 100));
        item.endTime = `${newEndHour.toString().padStart(2, '0')}:00`;
      } else {
        const newWidth = startWidth + e.clientX - startX;
        setWidth(Math.max(180, newWidth));
        const newEndHour = startHour + Math.max(1, Math.round(newWidth / 180));
        item.endTime = `${newEndHour.toString().padStart(2, '0')}:00`;
      }
    };

    const stopDrag = () => {
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const startHour = parseInt(item.startTime.split(':')[0]);
  const itemStyle = {
    position: 'absolute' as const,
    top: isVertical ? `${(startHour - currentHour) * 100}px` : 0,
    left: isVertical ? 0 : `${(startHour - currentHour) * 180}px`,
    height: isVertical ? `${height}px` : '100%',
    width: isVertical ? '100%' : `${width}px`,
    zIndex: 10,
  };

  const [, drag] = useDrag({
    type: 'AGENDA_ITEM',
    item: { id: item.id, index },
  });

  const [, drop] = useDrop({
    accept: 'AGENDA_ITEM',
    hover: (draggedItem: { id: string; index: number }) => {
      if (draggedItem.index !== index) {
        // Handle item reordering logic here
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={itemStyle}>
      <Card className="relative">
        <CardContent className="p-2 h-full">
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {`${item.startTime} - ${item.endTime}`}
          </p>
        </CardContent>
        {isVertical ? (
          <div
            className="absolute bottom-0 left-0 right-0 h-2 bg-primary/20 cursor-ns-resize"
            onMouseDown={(e) => handleResize(e, 'height')}
          />
        ) : (
          <div
            className="absolute top-0 bottom-0 right-0 w-2 bg-primary/20 cursor-ew-resize"
            onMouseDown={(e) => handleResize(e, 'width')}
          />
        )}
      </Card>
    </div>
  );
};

export default AgendaItem;

