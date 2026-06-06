import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import type { Booking } from '../types';

const localizer = momentLocalizer(moment);


export default function BookCalendar({ bookings }: { bookings: Booking[] }) {
    // Map your backend data to the format the Calendar needs
    const events = bookings.map(booking => ({
        title: `user: ${booking.userName}`,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
    }));

    return (
        <div style={{ height: '500px',width: '100%' }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                defaultView="day"
            />
        </div>
    );
};