// ==============================|| DISPATCH ORDER CALENDAR COMPONENT ||============================== //

import type { EventClickArg, EventDropArg, DateSelectArg, DatesSetArg } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import type { DispatchOrder } from '../types';
import { DISPATCH_ORDER_URLS } from '../types/constants';

// ==============================|| TYPES ||============================== //

interface DispatchOrderCalendarProps {
  orders: DispatchOrder[];
  view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange?: (view: string) => void;
  onEventClick?: (order: DispatchOrder) => void;
  onEventDrop?: (order: DispatchOrder, newStart: Date) => void;
  onDateSelect?: (start: Date, end: Date) => void;
  vehicleFilter?: string; // Vehicle ID to filter
}

// ==============================|| HELPER: CONVERT ORDER TO CALENDAR EVENT ||============================== //

const orderToEvent = (order: DispatchOrder) => {
  const start = dateHelper.normalizeDateValue(order.departureTime);
  const startDate = start ? start.toDate() : null;
  const end = startDate ? new Date(startDate.getTime() + (order.estimatedDuration || 0) * 60 * 60 * 1000) : null;

  // Get color based on status - tất cả màu trắng, không border
  let backgroundColor = '#ffffff'; // white
  let borderColor = 'transparent';
  let textColor = '#373a3c';

  switch (order.status) {
    case 'new':
      backgroundColor = '#ffffff'; // white
      borderColor = 'transparent';
      textColor = '#373a3c';
      break;
    case 'running':
      backgroundColor = '#ffffff'; // white
      borderColor = 'transparent';
      textColor = '#373a3c';
      break;
    case 'completed':
      backgroundColor = '#ffffff'; // white
      borderColor = 'transparent';
      textColor = '#373a3c';
      break;
  }

  return {
    id: order.id,
    title: `${order.orderCode} - ${order.vehicleLicensePlate}`,
    start: startDate?.toISOString() || new Date().toISOString(),
    end: end?.toISOString() || undefined,
    backgroundColor,
    borderColor,
    textColor,
    extendedProps: {
      order
    },
    // Show icon for running orders
    classNames: order.status === 'running' ? ['fc-event-running'] : []
  };
};

// ==============================|| MAIN COMPONENT ||============================== //

const DispatchOrderCalendar = ({
  orders,
  view = 'dayGridMonth',
  onViewChange,
  onEventClick,
  onEventDrop,
  onDateSelect,
  vehicleFilter
}: DispatchOrderCalendarProps) => {
  const navigate = useNavigate();

  // Filter orders by vehicle if filter is set
  const filteredOrders = useMemo(() => {
    if (!vehicleFilter) return orders;
    return orders.filter((order) => order.vehicleId === vehicleFilter);
  }, [orders, vehicleFilter]);

  // Convert orders to calendar events
  const events = useMemo(() => {
    return filteredOrders.map(orderToEvent);
  }, [filteredOrders]);

  // Handle event click - navigate to detail or edit
  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const order = clickInfo.event.extendedProps.order as DispatchOrder;
      if (onEventClick) {
        onEventClick(order);
      } else {
        // Default: navigate to detail page
        navigate(DISPATCH_ORDER_URLS.DETAIL(order.id));
      }
    },
    [navigate, onEventClick]
  );

  // Handle event drop - update order departure time
  const handleEventDrop = useCallback(
    (dropInfo: EventDropArg) => {
      const order = dropInfo.event.extendedProps.order as DispatchOrder;
      const newStart = dropInfo.event.start || new Date();
      if (onEventDrop) {
        onEventDrop(order, newStart);
      } else {
        // Default: show alert (mock)
        console.warn('Update order departure time:', order.id, newStart);
        alert(`Cập nhật thời gian xuất phát cho lệnh ${order.orderCode} (Mock)`);
      }
    },
    [onEventDrop]
  );

  // Handle date select - create new order
  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      if (onDateSelect) {
        onDateSelect(selectInfo.start, selectInfo.end);
      } else {
        // Default: navigate to create page
        navigate(DISPATCH_ORDER_URLS.NEW);
      }
    },
    [navigate, onDateSelect]
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

  return (
    <MainCard contentSX={{ p: 0 }}>
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
        editable={true} // Allow drag and drop
        droppable={false}
        select={handleDateSelect}
        datesSet={handleViewChange}
        // Custom event rendering for running orders with icon
        eventContent={(eventInfo) => {
          const order = eventInfo.event.extendedProps.order as DispatchOrder;
          const isRunning = order.status === 'running';
          return {
            html: `
              <div style="display: flex; align-items: center; gap: 4px; padding: 2px 4px;">
                ${isRunning ? '<span style="font-size: 14px;">🚚</span>' : ''}
                <span style="font-weight: 600;">${eventInfo.event.title}</span>
              </div>
            `
          };
        }}
        // Custom styles
        eventClassNames={(eventInfo) => {
          const order = eventInfo.event.extendedProps.order as DispatchOrder;
          return order.status === 'running' ? ['fc-event-running'] : [];
        }}
      />
    </MainCard>
  );
};

export default DispatchOrderCalendar;
