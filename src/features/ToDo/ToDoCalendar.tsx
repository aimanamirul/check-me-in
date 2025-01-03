import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from '@/components/ui/calendar'
import { useApp } from '@/context/AppContext'

export function ToDoCalendar() {
    const { selectedDate, setSelectedDate } = useApp();

    return (
        <Card>
            <CardHeader>
                <CardTitle>To-Do Calendar</CardTitle>
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