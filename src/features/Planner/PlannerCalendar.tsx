import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from '@/components/ui/calendar'
import { useApp } from '@/context/AppContext'
import { useState } from 'react'
import { Button } from "@/components/ui/button"

export function PlannerCalendar() {
    const { selectedDate, setSelectedDate } = useApp();
    const [viewMode, setViewMode] = useState<'horizontal' | 'vertical'>('vertical');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Planner Calendar</CardTitle>
            </CardHeader>
            <CardContent>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                        if (date && date !== selectedDate) {
                            setSelectedDate(date);
                        }
                    }}
                    className="rounded-md border"
                />
                <div className="flex space-x-4 my-4">
                    <Button onClick={() => setViewMode('horizontal')} variant={viewMode === 'horizontal' ? 'default' : 'outline'}>
                        Horizontal View
                    </Button>
                    <Button onClick={() => setViewMode('vertical')} variant={viewMode === 'vertical' ? 'default' : 'outline'}>
                        Vertical View
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
