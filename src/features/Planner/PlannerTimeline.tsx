import React, { useRef, useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import AgendaItem from './AgendaItem';
import { AgendaItem as AgendaItemType } from '@/util/types';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface PlannerTimelineProps {
  agendaItems: AgendaItemType[];
  isVertical: boolean;
  onMoveItem: (id: string, startHour: number) => void;
  onResizeItem: (id: string, endHour: number) => void;
  onRemoveItem: (id: string) => void;
}

const PlannerTimeline: React.FC<PlannerTimelineProps> = ({ agendaItems, isVertical, onMoveItem, onResizeItem, onRemoveItem }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const getItemsForHour = (hour: number) => {
    return agendaItems.filter(item => item.startHour <= hour && item.endHour > hour);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isVertical && scrollRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, []);

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border">
      <div
        ref={scrollRef}
        className={`p-4 ${isVertical ? '' : 'flex'}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ 
          cursor: isDragging ? 'grabbing' : (isVertical ? 'default' : 'grab'),
          userSelect: 'none'
        }}
      >
        {hours.map((hour) => (
          <HourSlot 
            key={hour} 
            hour={hour} 
            isVertical={isVertical} 
            items={getItemsForHour(hour)}
            onMoveItem={onMoveItem}
            onResizeItem={onResizeItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
      {!isVertical && <ScrollBar orientation="horizontal" />}
    </ScrollArea>
  );
};

interface HourSlotProps {
  hour: number;
  isVertical: boolean;
  items: AgendaItemType[];
  onMoveItem: (id: string, startHour: number) => void;
  onResizeItem: (id: string, endHour: number) => void;
  onRemoveItem: (id: string) => void;
}

const HourSlot: React.FC<HourSlotProps> = ({ hour, isVertical, items, onMoveItem, onResizeItem, onRemoveItem }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'agendaItem',
    drop: (item: { id: string }) => onMoveItem(item.id, hour),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`
        ${isVertical ? 'flex items-start border-b py-2' : 'inline-block border-r px-2 h-full'}
        ${isOver ? 'bg-accent' : ''}
        ${isVertical ? 'w-full' : 'w-48'}
      `}
    >
      <div className={`font-semibold text-muted-foreground ${isVertical ? 'w-16' : 'h-8'}`}>
        {`${hour.toString().padStart(2, '0')}:00`}
      </div>
      <div className={`${isVertical ? 'flex-1' : 'min-h-[100px]'}`}>
        {items.map((item) => (
          <AgendaItem 
            key={`${item.id}-${hour}`}
            item={item} 
            isVertical={isVertical}
            currentHour={hour}
            onResizeItem={onResizeItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};

export default PlannerTimeline;

