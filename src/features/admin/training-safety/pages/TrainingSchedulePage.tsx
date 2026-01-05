// ==============================|| TRAINING SCHEDULE PAGE ||============================== //

import type { EventClickArg, EventDropArg, DateSelectArg, DatesSetArg } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';

import { getMockComplaints } from '../../complaints/mock/complaints';
import type { Complaint } from '../../complaints/types';
import { getMockTrainings } from '../mock/trainings';
import type { Training } from '../types';
import { TRAINING_URLS } from '../types/constants';

// ==============================|| TYPES ||============================== //

interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  color?: string;
  extendedProps?: {
    type: 'training' | 'complaint';
    data: Training | Complaint;
  };
}

// ==============================|| TRAINING SCHEDULE PAGE ||============================== //

const TrainingSchedulePage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
  const trainings = getMockTrainings();
  const complaints = getMockComplaints();

  // Convert trainings to calendar events
  const trainingEvents = useMemo<CalendarEvent[]>(() => {
    return trainings.map((training) => {
      let color = '#1976d2'; // Default blue
      if (training.type === 'safety') {
        color = '#d32f2f'; // Red for safety
      } else if (training.type === 'skill') {
        color = '#1976d2'; // Blue for skill
      }

      return {
        id: `training-${training.id}`,
        title: training.name,
        start: training.startDate,
        end: training.endDate,
        allDay: true,
        color,
        extendedProps: {
          type: 'training',
          data: training
        }
      };
    });
  }, [trainings]);

  // Convert complaints to calendar events (only processing ones with scheduled date)
  const complaintEvents = useMemo<CalendarEvent[]>(() => {
    return complaints
      .filter((complaint) => complaint.status === 'processing')
      .map((complaint) => ({
        id: `complaint-${complaint.id}`,
        title: `⚠️ ${complaint.code}`,
        start: complaint.receivedDate,
        allDay: true,
        color: '#ff9800', // Orange for complaints
        extendedProps: {
          type: 'complaint',
          data: complaint
        }
      }));
  }, [complaints]);

  const events = useMemo(() => [...trainingEvents, ...complaintEvents], [trainingEvents, complaintEvents]);

  // Handle event click
  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const event = clickInfo.event;
      const extendedProps = event.extendedProps as CalendarEvent['extendedProps'];
      if (extendedProps?.type === 'training') {
        const training = extendedProps.data as Training;
        navigate(TRAINING_URLS.DETAIL(training.id));
      } else if (extendedProps?.type === 'complaint') {
        // TODO: Navigate to complaint detail
        // const complaint = extendedProps.data as Complaint;
        // navigate(COMPLAINT_URLS.DETAIL(complaint.id));
      }
    },
    [navigate]
  );

  // Handle date select - create new training
  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      // Navigate to create training page
      navigate(TRAINING_URLS.NEW);
    },
    [navigate]
  );

  // Handle view change
  const handleViewChange = useCallback((arg: DatesSetArg) => {
    setView(arg.view.type as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek');
  }, []);

  // Handle event drop (for week/day views)
  const handleEventDrop = useCallback((dropInfo: EventDropArg) => {
    // TODO: Update training schedule date
    // const event = dropInfo.event;
    // const extendedProps = event.extendedProps as CalendarEvent['extendedProps'];
    // if (extendedProps?.type === 'training') {
    //   await trainingService.updateTraining(extendedProps.data.id, { startDate: dropInfo.event.start });
    // }
  }, []);

  // Custom event rendering
  const eventContent = useCallback(
    (eventInfo: { event: { title: string; extendedProps?: CalendarEvent['extendedProps'] } }) => {
      const extendedProps = eventInfo.event.extendedProps as CalendarEvent['extendedProps'];
      if (view === 'timeGridDay' && extendedProps?.type === 'training') {
        return {
          html: `
          <div style="display: flex; align-items: center; gap: 4px; padding: 2px 4px;">
            <span style="font-size: 14px;">📚</span>
            <span style="font-weight: 600;">${eventInfo.event.title}</span>
          </div>
        `
        };
      }
      return { html: `<div style="font-weight: 600;">${eventInfo.event.title}</div>` };
    },
    [view]
  );

  return (
    <MainCard
      title="Sắp lịch đào tạo"
      contentSX={{
        p: 0,
        '& .fc-event:hover': {
          opacity: '1 !important',
          backgroundColor: 'inherit !important',
          borderColor: 'inherit !important',
          color: 'inherit !important'
        }
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView={view}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }}
        buttonText={{
          today: 'Hôm nay',
          month: 'Tháng',
          week: 'Tuần',
          day: 'Ngày',
          list: 'Danh sách'
        }}
        locale={viLocale}
        events={events}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height="auto"
        eventDisplay="block"
        editable={view !== 'dayGridMonth'} // Only allow drag and drop for Week/Day views
        droppable={false}
        select={handleDateSelect}
        datesSet={handleViewChange}
        eventContent={eventContent}
      />
    </MainCard>
  );
};

export default TrainingSchedulePage;
