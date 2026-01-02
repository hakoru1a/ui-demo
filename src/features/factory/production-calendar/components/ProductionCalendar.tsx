// ==============================|| PRODUCTION CALENDAR COMPONENT ||============================== //

import type { EventClickArg, EventDropArg, DateSelectArg, DatesSetArg } from '@fullcalendar/core';
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

import type { Batch } from '../../batches/types';
import type { ProductionShift, ShiftProduction, CalendarEventData } from '../types';

// ==============================|| TYPES ||============================== //

interface ProductionCalendarProps {
  batches: Batch[];
  shifts: ProductionShift[];
  productions?: ShiftProduction[]; // For Day view
  view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange?: (view: string) => void;
  onEventClick?: (data: CalendarEventData) => void;
  onEventDrop?: (shift: ProductionShift, newStart: Date) => void;
  onDateSelect?: (start: Date, end: Date) => void;
  batchFilter?: string; // Batch ID to filter
  productionLineFilter?: string; // Production line ID to filter
}

// ==============================|| HELPER: GET COLOR BY STATUS ||============================== //

const getBatchColor = (status: Batch['status']) => {
  switch (status) {
    case 'in-progress':
      return { backgroundColor: '#1976d2', borderColor: '#1976d2', textColor: '#ffffff' }; // Blue
    case 'completed':
      return { backgroundColor: '#2e7d32', borderColor: '#2e7d32', textColor: '#ffffff' }; // Green
    case 'cancelled':
      return { backgroundColor: '#d32f2f', borderColor: '#d32f2f', textColor: '#ffffff' }; // Red
    default:
      return { backgroundColor: '#757575', borderColor: '#757575', textColor: '#ffffff' }; // Gray
  }
};

const getShiftColor = (status: ProductionShift['status']) => {
  switch (status) {
    case 'scheduled':
      return { backgroundColor: '#1976d2', borderColor: '#1976d2', textColor: '#ffffff' }; // Blue
    case 'in-progress':
      return { backgroundColor: '#ed6c02', borderColor: '#ed6c02', textColor: '#ffffff' }; // Orange
    case 'completed':
      return { backgroundColor: '#2e7d32', borderColor: '#2e7d32', textColor: '#ffffff' }; // Green
    case 'cancelled':
      return { backgroundColor: '#d32f2f', borderColor: '#d32f2f', textColor: '#ffffff' }; // Red
    default:
      return { backgroundColor: '#757575', borderColor: '#757575', textColor: '#ffffff' }; // Gray
  }
};

// ==============================|| HELPER: CONVERT BATCH TO CALENDAR EVENT ||============================== //

const batchToEvent = (batch: Batch) => {
  const start = dateHelper.normalizeDateValue(batch.startDate);
  const startDate = start ? start.toDate() : new Date();
  const end = batch.endDate ? dateHelper.normalizeDateValue(batch.endDate)?.toDate() : undefined;

  const colors = getBatchColor(batch.status);

  return {
    id: `batch-${batch.id}`,
    title: `${batch.code} - ${batch.productName}`,
    start: startDate.toISOString(),
    end: end?.toISOString() || undefined,
    allDay: true,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    textColor: colors.textColor,
    extendedProps: {
      type: 'batch',
      batch
    } as CalendarEventData
  };
};

// ==============================|| HELPER: CONVERT SHIFT TO CALENDAR EVENT ||============================== //

const shiftToEvent = (shift: ProductionShift, production?: ShiftProduction) => {
  const start = dateHelper.normalizeDateValue(shift.startTime);
  const startDate = start ? start.toDate() : new Date();
  const end = dateHelper.normalizeDateValue(shift.endTime);
  const endDate = end ? end.toDate() : undefined;

  const colors = getShiftColor(shift.status);

  // For Day view, include production quantity
  const title = production
    ? `${shift.batchCode} - ${shift.productionLineName} (${production.quantity} ${production.unit})`
    : `${shift.batchCode} - ${shift.productionLineName}`;

  return {
    id: `shift-${shift.id}`,
    title,
    start: startDate.toISOString(),
    end: endDate?.toISOString() || undefined,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    textColor: colors.textColor,
    extendedProps: {
      type: production ? 'production' : 'shift',
      shift,
      production
    } as CalendarEventData
  };
};

// ==============================|| MAIN COMPONENT ||============================== //

const ProductionCalendar = ({
  batches,
  shifts,
  productions = [],
  view = 'dayGridMonth',
  onViewChange,
  onEventClick,
  onEventDrop,
  onDateSelect,
  batchFilter,
  productionLineFilter
}: ProductionCalendarProps) => {
  // Filter batches and shifts
  const filteredBatches = useMemo(() => {
    if (!batchFilter) return batches;
    return batches.filter((batch) => batch.id === batchFilter);
  }, [batches, batchFilter]);

  const filteredShifts = useMemo(() => {
    let result = shifts;
    if (batchFilter) {
      result = result.filter((shift) => shift.batchId === batchFilter);
    }
    if (productionLineFilter) {
      result = result.filter((shift) => shift.productionLineId === productionLineFilter);
    }
    return result;
  }, [shifts, batchFilter, productionLineFilter]);

  // Create a map of shiftId to production for Day view
  const productionMap = useMemo(() => {
    const map = new Map<string, ShiftProduction>();
    productions.forEach((prod) => {
      map.set(prod.shiftId, prod);
    });
    return map;
  }, [productions]);

  // Convert to calendar events based on view
  const events = useMemo(() => {
    if (view === 'dayGridMonth') {
      // Month view: Show batches
      return filteredBatches.map(batchToEvent);
    } else {
      // Week/Day view: Show shifts (with production data for Day view)
      return filteredShifts.map((shift) => {
        const production = view === 'timeGridDay' ? productionMap.get(shift.id) : undefined;
        return shiftToEvent(shift, production);
      });
    }
  }, [view, filteredBatches, filteredShifts, productionMap]);

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

  // Handle event drop - update shift time
  const handleEventDrop = useCallback(
    (dropInfo: EventDropArg) => {
      const eventData = dropInfo.event.extendedProps as CalendarEventData;
      if (eventData.shift && onEventDrop) {
        const newStart = dropInfo.event.start || new Date();
        onEventDrop(eventData.shift, newStart);
      }
    },
    [onEventDrop]
  );

  // Handle date select - create new shift
  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      if (onDateSelect) {
        onDateSelect(selectInfo.start, selectInfo.end);
      }
    },
    [onDateSelect]
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

  // Custom event rendering for Day view with production icon
  const eventContent = useCallback(
    (eventInfo: any) => {
      const eventData = eventInfo.event.extendedProps as CalendarEventData;
      if (view === 'timeGridDay' && eventData.production) {
        return {
          html: `
            <div style="display: flex; align-items: center; gap: 4px; padding: 2px 4px;">
              <span style="font-size: 14px;">📊</span>
              <span style="font-weight: 600;">${eventInfo.event.title}</span>
            </div>
          `
        };
      }
      // Return default rendering for other cases
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

export default ProductionCalendar;
