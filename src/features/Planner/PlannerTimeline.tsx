import React from 'react';
import { useDrop } from 'react-dnd';
import AgendaItem from './AgendaItem';
import { Agenda as AgendaItemType } from '../../util/types';
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimelineProps {
  agendaItems: AgendaItemType[];
  isVertical: boolean;
}

const PlannerTimeline: React.FC<TimelineProps> = ({ agendaItems, isVertical }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getItemsForHour = (hour: number) => {
    return agendaItems.filter(item => Number(item.startTime) <= hour && Number(item.endTime) > hour);
  };

  const renderDroppableArea = (hour: number) => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'AGENDA_ITEM',
      drop: () => ({ hour }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }));

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
        <div className={`${isVertical ? 'flex-1' : 'min-h-[100px]'} relative`}>
          {getItemsForHour(hour).map((item, index) => (
            <AgendaItem 
              key={item.id} 
              item={item} 
              index={index} 
              isVertical={isVertical}
              currentHour={hour}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className={`h-[600px] w-full rounded-md border ${isVertical ? '' : 'overflow-x-auto'}`}>
      <div className={`p-4 ${isVertical ? '' : 'flex'}`}>
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {renderDroppableArea(hour)}
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  );
};

export default PlannerTimeline;

