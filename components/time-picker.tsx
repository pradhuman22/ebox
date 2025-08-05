'use client';

import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value?: string;
  onChange: (value: string | undefined) => void;
}

const TimePicker = ({ value, onChange }: TimePickerProps) => {
  const [selectedTime, setSelectedTime] = useState<string>(value || '09:00');

  useEffect(() => {
    if (value) {
      setSelectedTime(value);
    }
  }, [value]);

  const generateTimeOptions = () => {
    const times: string[] = [];
    for (let h = 9; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    times.push(`00:00`);
    return times;
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    onChange(time);
  };

  return (
    <Select value={selectedTime} onValueChange={handleSelectTime}>
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground h-4 w-4" />
          <SelectValue placeholder="Select time" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <div className="max-h-[300px] overflow-y-auto">
          {generateTimeOptions().map(time => (
            <SelectItem key={time} value={time}>
              {time}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
};

export default TimePicker;
