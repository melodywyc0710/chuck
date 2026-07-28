import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Popover,
} from 'react-aria-components';
import type { DatePickerProps, DateValue } from 'react-aria-components';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';

export function DatePicker(props: DatePickerProps<DateValue>) {
  return (
    <AriaDatePicker {...props}>
      <Group className="date-picker-group">
        <DateInput className="date-picker-input">
          {seg => <DateSegment segment={seg} className="date-picker-segment" />}
        </DateInput>
        <Button className="date-picker-btn">
          <CalendarDays size={14} />
        </Button>
      </Group>
      <Popover className="date-picker-popover" placement="bottom start">
        <Dialog className="date-picker-dialog">
          <Calendar>
            <header className="date-picker-cal-header">
              <Button slot="previous" className="date-picker-nav-btn"><ChevronLeft size={14} /></Button>
              <Heading className="date-picker-heading" />
              <Button slot="next" className="date-picker-nav-btn"><ChevronRight size={14} /></Button>
            </header>
            <CalendarGrid>
              <CalendarGridHeader>
                {day => <CalendarHeaderCell className="date-picker-day-header">{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {date => <CalendarCell date={date} className="date-picker-cell" />}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
