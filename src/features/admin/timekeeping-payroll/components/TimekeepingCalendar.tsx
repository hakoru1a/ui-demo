// ==============================|| TIMEKEEPING CALENDAR COMPONENT ||============================== //

import type { EventClickArg, EventDropArg, DateSelectArg, DatesSetArg, EventContentArg } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useCallback, useMemo } from 'react';

// project imports
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import type { WorkShift, WorkHour, CalendarEventData, WorkShiftType } from '../types/index';
import { WORK_SHIFT_TYPE_OPTIONS } from '../types/index';

// ==============================|| TYPES ||============================== //

interface TimekeepingCalendarProps {
  shifts: WorkShift[];
  workHours?: WorkHour[]; // For Day view
  view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange?: (view: string) => void;
  onEventClick?: (data: CalendarEventData) => void;
  onEventDrop?: (shift: WorkShift, newStart: Date) => void;
  onDateSelect?: (start: Date, end: Date) => void;
  employeeFilter?: string; // Employee ID to filter
  isLocked?: boolean; // Whether the period is locked
}

// ==============================|| HELPER: GET COLOR BY SHIFT TYPE ||============================== //

const getShiftColor = (shiftType: WorkShiftType) => {
  const option = WORK_SHIFT_TYPE_OPTIONS.find((opt) => opt.value === shiftType);
  return option
    ? { backgroundColor: option.color, borderColor: option.color, textColor: '#ffffff' }
    : { backgroundColor: '#757575', borderColor: '#757575', textColor: '#ffffff' };
};

// ==============================|| HELPER: CONVERT SHIFT TO CALENDAR EVENT ||============================== //

const shiftToEvent = (shift: WorkShift) => {
  const start = dateHelper.normalizeDateValue(shift.startTime);
  const startDate = start ? start.toDate() : new Date();
  const end = dateHelper.normalizeDateValue(shift.endTime);
  const endDate = end ? end.toDate() : undefined;

  const colors = getShiftColor(shift.shiftType);
  const shiftLabel = WORK_SHIFT_TYPE_OPTIONS.find((opt) => opt.value === shift.shiftType)?.label || shift.shiftType;

  return {
    id: `shift-${shift.id}`,
    title: `${shift.employeeName} - ${shiftLabel}`,
    start: startDate.toISOString(),
    end: endDate?.toISOString() || undefined,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    textColor: colors.textColor,
    extendedProps: {
      type: 'shift',
      shift
    } as CalendarEventData
  };
};

// ==============================|| HELPER: CONVERT WORK HOUR TO CALENDAR EVENT ||============================== //

const workHourToEvent = (hour: WorkHour) => {
  const workDate = dateHelper.normalizeDateValue(hour.workDate);
  const date = workDate ? workDate.toDate() : new Date();

  // For Day view, show work hours as all-day events with details
  return {
    id: `hour-${hour.id}`,
    title: `${hour.employeeName} - ${hour.totalHours}h (${hour.regularHours}h + ${hour.overtimeHours}h OT)`,
    start: date.toISOString(),
    allDay: true,
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
    textColor: '#ffffff',
    extendedProps: {
      type: 'hour',
      hour
    } as CalendarEventData
  };
};

// ==============================|| MAIN COMPONENT ||============================== //

const TimekeepingCalendar = ({
  shifts,
  workHours = [],
  view = 'dayGridMonth',
  onViewChange,
  onEventClick,
  onEventDrop,
  onDateSelect,
  employeeFilter,
  isLocked = false
}: TimekeepingCalendarProps) => {
  // Filter shifts by employee if filter is set
  const filteredShifts = useMemo(() => {
    if (!employeeFilter) return shifts;
    return shifts.filter((shift) => shift.employeeId === employeeFilter);
  }, [shifts, employeeFilter]);

  const filteredWorkHours = useMemo(() => {
    if (!employeeFilter) return workHours;
    return workHours.filter((hour) => hour.employeeId === employeeFilter);
  }, [workHours, employeeFilter]);

  // Convert to calendar events based on view
  const events = useMemo(() => {
    if (view === 'timeGridDay') {
      // Day view: Show work hours with details
      return filteredWorkHours.map(workHourToEvent);
    } else {
      // Month/Week view: Show work shifts
      return filteredShifts.map(shiftToEvent);
    }
  }, [view, filteredShifts, filteredWorkHours]);

  // Handle event click
  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const eventData = clickInfo.event.extendedProps as CalendarEventData;
      if (onEventClick) {
        onEventClick(eventData);
      }
    },
    [onEventClick]
  );

  // Handle event drop - update shift time (only for Week view)
  const handleEventDrop = useCallback(
    (dropInfo: EventDropArg) => {
      if (isLocked) return; // Don't allow drop if locked
      const eventData = dropInfo.event.extendedProps as CalendarEventData;
      if (eventData.shift && onEventDrop) {
        const newStart = dropInfo.event.start || new Date();
        onEventDrop(eventData.shift, newStart);
      }
    },
    [onEventDrop, isLocked]
  );

  // Handle date select - quick add
  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      if (isLocked) return; // Don't allow select if locked
      if (onDateSelect) {
        onDateSelect(selectInfo.start, selectInfo.end);
      }
    },
    [onDateSelect, isLocked]
  );

  // Handle view change
  const handleViewChange = useCallback(
    (arg: DatesSetArg) => {
      if (onViewChange) {
        onViewChange(arg.view.type);
      }
    },
    [onViewChange]
  );

  // Custom event rendering based on view
  const eventContent = useCallback(
    (eventInfo: EventContentArg) => {
      const eventData = eventInfo.event.extendedProps as CalendarEventData;

      if (view === 'timeGridWeek') {
        // Week view: Show label + icon
        const shiftLabel = eventData.shift
          ? WORK_SHIFT_TYPE_OPTIONS.find((opt) => opt.value === eventData.shift?.shiftType)?.label || ''
          : '';
        return {
          html: `
            <div style="display: flex; align-items: center; gap: 4px; padding: 2px 4px;">
              <span style="font-size: 14px;">🕐</span>
              <span style="font-weight: 600;">${shiftLabel}</span>
            </div>
          `
        };
      } else if (view === 'timeGridDay') {
        // Day view: Show detailed work hours
        return {
          html: `
            <div style="padding: 2px 4px; font-weight: 600;">${eventInfo.event.title}</div>
          `
        };
      }
      // Month view: Default rendering
      return {
        html: `<div style="padding: 2px 4px; font-weight: 600;">${eventInfo.event.title}</div>`
      };
    },
    [view]
  );

  return (
    <MainCard
      contentSX={{
        p: 0,
        '& .fc-event:hover': {
          opacity: '1 !important',
          backgroundColor: 'inherit !important',
          borderColor: 'inherit !important',
          color: 'inherit !important'
        },
        '& .fc-daygrid-event:hover': {
          opacity: '1 !important',
          backgroundColor: 'inherit !important',
          borderColor: 'inherit !important',
          color: 'inherit !important'
        },
        '& .fc-timegrid-event:hover': {
          opacity: '1 !important',
          backgroundColor: 'inherit !important',
          borderColor: 'inherit !important',
          color: 'inherit !important'
        },
        '& .fc-list-event:hover': {
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
        selectable={!isLocked}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height="auto"
        eventDisplay="block"
        editable={view === 'timeGridWeek' && !isLocked} // Only allow drag and drop for Week view and not locked
        droppable={false}
        select={handleDateSelect}
        datesSet={handleViewChange}
        eventContent={eventContent}
      />
    </MainCard>
  );
};

export default TimekeepingCalendar;
