import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { setBestContactTime } from '../../store/commands';
import { getFieldLabel } from '../../utils';
import './Calendar.sass';

const advancedFormat = require('dayjs/plugin/advancedFormat');

dayjs.extend(advancedFormat);

function splitInterval(start, end, step) {
  const result = [];
  for (
    let ts = Number(dayjs(start).format('X'));
    ts < Number(dayjs(end).format('X'));
    ts += step
  ) {
    result.push({
      startTime: dayjs.unix(ts),
      endTime: dayjs.unix(ts + step),
    });
  }
  if (result.length === 1) {
    result[result.length] = end;
  }
  return result;
}

const Calendar = (props) => {
  const [freeTime, setFreeTime] = useState();
  const [events, setEvents] = useState();
  const [startTime, setStart] = useState();
  const [endTime, setEnd] = useState();
  const { email } = props;
  const { headerType } = props;
  const dispatch = useDispatch();

  const setTime = (time) => {
    setStart(time.startStr);
    setEnd(time.endStr);
  };
  useEffect(() => {
    setEvents({ googleCalendarId: email });
  }, []);
  useEffect(() => {
    if (startTime && endTime) {
      const interval = 1800;
      const result = splitInterval(startTime, endTime, interval);
      setFreeTime(result);
    }
  }, [startTime, endTime]);

  return (
    <FullCalendar
      plugins={[
        timeGridPlugin,
        listPlugin,
        dayGridPlugin,
        googleCalendarPlugin,
        interactionPlugin,
      ]}
      customButtons={{
        approveButton: {
          text: getFieldLabel('profile.calendar.button'),
          click: () => {
            dispatch(setBestContactTime(freeTime));
            setFreeTime();
          },
        },
        textButton: {
          text: freeTime
            ? getFieldLabel('profile.calendar.buttonText.full')
                .replace(
                  /%(\w*)%/,
                  `${dayjs(startTime).format('DD/MM/YYYY h:mm a')}`,
                )
                .replace(/%(\w*)%/, `${dayjs(endTime).format('DD/MM h:mm a')}`)
            : getFieldLabel('profile.calendar.buttonText.empty'),
          click: () => {},
        },
      }}
      headerToolbar={headerType}
      footerToolbar={{
        start: 'textButton',
        center: '',
        end: 'approveButton',
      }}
      initialView="timeGridWeek"
      allDaySlot={false}
      height="100%"
      expandRows
      navLinks
      selectable
      select={setTime}
      listDayFormat={false}
      slotMinTime="08:00:00"
      editable
      googleCalendarApiKey="AIzaSyCN8PD2jFBb_K6p7U7PpWQ6JuYb_CAptkU"
      events={events}
    />
  );
};

export default Calendar;
