'use client';

/* ==========================================================================
   Calendar Page
   View and manage schedule
   ========================================================================== */

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// ==========================================================================
// Types
// ==========================================================================

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'deadline' | 'invoice' | 'other';
  color: string;
  description?: string;
}

// ==========================================================================
// Calendar Events Data
// ==========================================================================

const initialEventsData: CalendarEvent[] = [
  { id: '1', title: 'Client Meeting - TechCorp', date: '2026-02-03', time: '10:00 AM', type: 'meeting', color: 'bg-blue-500', description: 'Discuss project requirements' },
  { id: '2', title: 'Project Deadline - E-Commerce', date: '2026-02-05', time: '5:00 PM', type: 'deadline', color: 'bg-red-500', description: 'Final delivery due' },
  { id: '3', title: 'Design Review', date: '2026-02-07', time: '2:00 PM', type: 'meeting', color: 'bg-blue-500', description: 'Review design mockups' },
  { id: '4', title: 'Invoice Due - StartupXYZ', date: '2026-02-10', time: '12:00 PM', type: 'invoice', color: 'bg-green-500', description: 'Payment reminder' },
  { id: '5', title: 'Team Standup', date: '2026-02-03', time: '9:00 AM', type: 'meeting', color: 'bg-purple-500', description: 'Daily team sync' },
];

// ==========================================================================
// Event Modal Component
// ==========================================================================

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent;
  selectedDate?: string;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, selectedDate, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: selectedDate || '',
    time: '',
    type: 'meeting' as CalendarEvent['type'],
    description: '',
  });

  React.useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        type: event.type,
        description: event.description || '',
      });
    } else if (selectedDate) {
      setFormData(prev => ({ ...prev, date: selectedDate }));
    } else {
      setFormData({
        title: '',
        date: selectedDate || '',
        time: '',
        type: 'meeting',
        description: '',
      });
    }
  }, [event, selectedDate, isOpen]);

  const getEventColor = (type: CalendarEvent['type']) => {
    const colors = {
      meeting: 'bg-blue-500',
      deadline: 'bg-red-500',
      invoice: 'bg-green-500',
      other: 'bg-gray-500',
    };
    return colors[type];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.time) return;

    onSave({
      ...formData,
      color: getEventColor(formData.type),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto animate-in zoom-in-95 duration-300 delay-150 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 pr-2">
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEvent['type'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="invoice">Invoice</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base resize-none"
              placeholder="Add event details..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base font-medium"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// Calendar Page Component
// ==========================================================================

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // February 2026
  const [events, setEvents] = useState<CalendarEvent[]>(initialEventsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate('');
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : e));
    } else {
      // Create new event
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Calendar</h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage your schedule and deadlines</p>
          </div>
          <button
            onClick={() => {
              setSelectedEvent(undefined);
              setSelectedDate('');
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base font-medium"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{monthName}</h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {days.map(day => (
              <div key={day} className="py-2 text-center text-xs sm:text-sm font-semibold text-gray-500">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 lg:h-24 bg-gray-50 rounded-md sm:rounded-lg" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = day === new Date().getDate() &&
                             currentDate.getMonth() === new Date().getMonth() &&
                             currentDate.getFullYear() === new Date().getFullYear();

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`h-16 sm:h-20 lg:h-24 p-1 sm:p-2 rounded-md sm:rounded-lg border transition-colors hover:border-primary cursor-pointer ${
                    isToday ? 'bg-primary/5 border-primary' : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-xs sm:text-sm font-medium ${isToday ? 'text-primary' : 'text-gray-900'}`}>
                    {day}
                  </span>
                  <div className="mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                        className={`text-xs text-white px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${event.color}`}
                      >
                        <span className="hidden sm:inline">{event.title.split(' - ')[0]}</span>
                        <span className="sm:hidden">{event.title.split(' - ')[0].slice(0, 6)}...</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Upcoming Events</h3>
          <div className="space-y-3 sm:space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="flex gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className={`w-1 rounded-full ${event.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.time}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEvent(event.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                  >
                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(undefined);
          setSelectedDate('');
        }}
        event={selectedEvent}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
      />
    </DashboardLayout>
  );
}
