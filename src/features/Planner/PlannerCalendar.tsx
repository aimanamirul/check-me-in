import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from '@/components/ui/calendar'
import { useApp } from '@/context/AppContext'
import { useState } from 'react'
import { Button } from "@/components/ui/button"

export function PlannerCalendar() {
    const { selectedDate, setSelectedDate } = useApp();

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
            </CardContent>
        </Card>
    )
}
