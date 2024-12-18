import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Agenda } from '../../util/types';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AgendaFormProps {
  onCreateAgendaItem: (newItem: Agenda) => void;
}

const AgendaForm: React.FC<AgendaFormProps> = ({ onCreateAgendaItem }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startHour, setStartHour] = useState('0');
  const [endHour, setEndHour] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: Agenda = {
      id: uuidv4(),
      title,
      description,
      startDate: new Date(),
      endDate: new Date(),
      startTime: `${startHour}:00`,
      endTime: `${endHour}:00`,
    };
    onCreateAgendaItem(newItem);
    setTitle('');
    setDescription('');
    setStartHour('0');
    setEndHour('1');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="startHour">Start Hour</Label>
          <Select value={startHour} onValueChange={(value) => {
            setStartHour(value);
            if (parseInt(value) >= parseInt(endHour)) {
              setEndHour((parseInt(value) + 1).toString());
            }
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select start hour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {`${i.toString().padStart(2, '0')}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="endHour">End Hour</Label>
          <Select value={endHour} onValueChange={setEndHour}>
            <SelectTrigger>
              <SelectValue placeholder="Select end hour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()} disabled={i + 1 <= parseInt(startHour)}>
                  {`${(i + 1).toString().padStart(2, '0')}:00`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Add Item</Button>
      </div>
    </form>
  );
};

export default AgendaForm;

