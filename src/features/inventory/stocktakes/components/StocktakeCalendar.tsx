// ==============================|| STOCKTAKE CALENDAR COMPONENT ||============================== //

import type { EventClickArg, DateSelectArg, DatesSetArg } from '@fullcalendar/core';
import viLocale from '@fullcalendar/core/locales/vi';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'components/MainCard';
import dateHelper from 'utils/dateHelper';

import type { Stocktake } from '../types';
import { STOCKTAKE_URLS } from '../types/constants';

// ==============================|| TYPES ||============================== //

interface StocktakeCalendarProps {
  stocktakes: Stocktake[];
  view?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  onViewChange?: (view: string) => void;
  onEventClick?: (stocktake: Stocktake) => void;
  onDateSelect?: (start: Date, end: Date) => void;
  warehouseFilter?: string; // Warehouse ID to filter
}

// ==============================|| HELPER: GET WAREHOUSE COLOR ||============================== //

// Color mapping for warehouses
const getWarehouseColor = (warehouseId: string): { backgroundColor: string; borderColor: string; textColor: string } => {
  const colors = [
    { backgroundColor: '#e3f2fd', borderColor: '#2196f3', textColor: '#1565c0' }, // Blue
    { backgroundColor: '#f3e5f5', borderColor: '#9c27b0', textColor: '#6a1b9a' }, // Purple
    { backgroundColor: '#e8f5e9', borderColor: '#4caf50', textColor: '#2e7d32' }, // Green
    { backgroundColor: '#fff3e0', borderColor: '#ff9800', textColor: '#e65100' }, // Orange
    { backgroundColor: '#fce4ec', borderColor: '#e91e63', textColor: '#c2185b' }, // Pink
    { backgroundColor: '#e0f2f1', borderColor: '#009688', textColor: '#00695c' } // Teal
  ];

  const index = parseInt(warehouseId) % colors.length;
  return colors[index] || colors[0];
};

// ==============================|| HELPER: CONVERT STOCKTAKE TO CALENDAR EVENT ||============================== //

const stocktakeToEvent = (stocktake: Stocktake, currentView: string) => {
  const start = dateHelper.normalizeDateValue(stocktake.inventoryDate);
  const startDate = start ? start.toDate() : new Date();

  const colors = getWarehouseColor(stocktake.warehouseId);

  // Determine event type and display based on view
  const isDayView = currentView === 'timeGridDay';
  const isMonthView = currentView === 'dayGridMonth';

  let title = '';
  let displayContent = '';

  if (isDayView) {
    // Day view: Show "Phiếu kiểm kê" with SKU labels
    const skuLabels = stocktake.items.map((item) => item.skuCode).join(', ');
    title = `${stocktake.code} - ${skuLabels}`;
    displayContent = skuLabels;
  } else if (isMonthView) {
    // Month view: Show "Kế hoạch kiểm kê" with checklist icon (read-only)
    title = `📋 ${stocktake.code} - ${stocktake.warehouseName}`;
    displayContent = `📋 ${stocktake.code}`;
  } else {
    // Week view: Show "Kỳ kiểm kê" colored by warehouse
    title = `${stocktake.code} - ${stocktake.warehouseName}`;
    displayContent = `${stocktake.code} - ${stocktake.warehouseName}`;
  }

  return {
    id: stocktake.id,
    title,
    start: startDate.toISOString(),
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    textColor: colors.textColor,
    extendedProps: {
      stocktake,
      displayContent,
      isDayView,
      isMonthView
    }
  };
};

// ==============================|| MAIN COMPONENT ||============================== //

const StocktakeCalendar = ({
  stocktakes,
  view = 'dayGridMonth',
  onViewChange,
  onEventClick,
  onDateSelect,
  warehouseFilter
}: StocktakeCalendarProps) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<string>(view);

  // Filter stocktakes by warehouse if filter is set
  const filteredStocktakes = useMemo(() => {
    if (!warehouseFilter) return stocktakes;
    return stocktakes.filter((stocktake) => stocktake.warehouseId === warehouseFilter);
  }, [stocktakes, warehouseFilter]);

  // Convert stocktakes to calendar events
  const events = useMemo(() => {
    return filteredStocktakes.map((stocktake) => stocktakeToEvent(stocktake, currentView));
  }, [filteredStocktakes, currentView]);

  // Handle event click - navigate to detail or edit
  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const stocktake = clickInfo.event.extendedProps.stocktake as Stocktake;
      const { isDayView, isMonthView } = clickInfo.event.extendedProps as {
        isDayView: boolean;
        isMonthView: boolean;
      };

      if (onEventClick) {
        onEventClick(stocktake);
      } else {
        // Default behavior:
        // - Day view: navigate to edit (if draft) or detail (if completed)
        // - Month view: navigate to detail (read-only)
        // - Week view: navigate to detail
        if (isMonthView || stocktake.status === 'completed') {
          navigate(STOCKTAKE_URLS.DETAIL(stocktake.id));
        } else if (isDayView && stocktake.status === 'draft') {
          navigate(STOCKTAKE_URLS.EDIT(stocktake.id));
        } else {
          navigate(STOCKTAKE_URLS.DETAIL(stocktake.id));
        }
      }
    },
    [navigate, onEventClick]
  );

  // Handle date select - create new stocktake
  const handleDateSelect = useCallback(
    (selectInfo: DateSelectArg) => {
      if (onDateSelect) {
        onDateSelect(selectInfo.start, selectInfo.end);
      } else {
        // Default: navigate to create page
        navigate(STOCKTAKE_URLS.NEW);
      }
    },
    [navigate, onDateSelect]
  );

  // Handle view change
  const handleViewChange = useCallback(
    (arg: DatesSetArg) => {
      setCurrentView(arg.view.type);
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
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height="auto"
        eventDisplay="block"
        editable={false} // Don't allow drag and drop for stocktakes
        droppable={false}
        select={handleDateSelect}
        datesSet={handleViewChange}
        // Custom event rendering
        eventContent={(eventInfo) => {
          const { displayContent, isDayView, isMonthView } = eventInfo.event.extendedProps as {
            displayContent: string;
            isDayView: boolean;
            isMonthView: boolean;
          };
          const stocktake = eventInfo.event.extendedProps.stocktake as Stocktake;

          if (isDayView) {
            // Day view: Show SKU labels
            return {
              html: `
                <div style="display: flex; flex-direction: column; padding: 4px 6px;">
                  <span style="font-weight: 600; font-size: 12px;">${stocktake.code}</span>
                  <span style="font-size: 11px; color: #666;">${displayContent}</span>
                </div>
              `
            };
          } else if (isMonthView) {
            // Month view: Show checklist icon
            return {
              html: `
                <div style="display: flex; align-items: center; gap: 4px; padding: 2px 4px;">
                  <span style="font-size: 14px;">📋</span>
                  <span style="font-weight: 600; font-size: 12px;">${stocktake.code}</span>
                </div>
              `
            };
          } else {
            // Week view: Show warehouse name with color
            return {
              html: `
                <div style="display: flex; align-items: center; gap: 4px; padding: 2px 4px;">
                  <span style="font-weight: 600;">${displayContent}</span>
                </div>
              `
            };
          }
        }}
      />
    </MainCard>
  );
};

export default StocktakeCalendar;
