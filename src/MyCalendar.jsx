// MyCalendar.js
// import React, { forwardRef, useImperativeHandle, useRef } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import googleCalendarPlugin from '@fullcalendar/google-calendar';

// const MyCalendar = forwardRef((props, ref) => {
//   const calendarRef = useRef();

//   useImperativeHandle(ref, () => ({
//     refetchEvents: () => {
//       let calendarApi = calendarRef.current.getApi();
//       calendarApi.refetchEvents();
//     }
//   }));

//   return (
//     <div>
//       <FullCalendar
//         ref={calendarRef}
//         plugins={[dayGridPlugin, googleCalendarPlugin]}
//         initialView="dayGridMonth"
//         googleCalendarApiKey="AIzaSyCQuk8YH5gHQ0qe_X34peiRAfDszV_q0Ng"
//         events={{
//           googleCalendarId: "umam.khan@outlook.com",
//         }}
//       />
//     </div>
//   );
// });

// export default MyCalendar;

import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

// Accept props in MyCalendar component
const MyCalendar = forwardRef(({ userEmail }, ref) => {
  const calendarRef = useRef();

  useImperativeHandle(ref, () => ({
    refetchEvents: () => {
      let calendarApi = calendarRef.current.getApi();
      calendarApi.refetchEvents();
    }
  }));

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, googleCalendarPlugin]}
        initialView="dayGridMonth"
        googleCalendarApiKey="AIzaSyCQuk8YH5gHQ0qe_X34peiRAfDszV_q0Ng"
        events={{
          // Use the userEmail prop to dynamically set the googleCalendarId
          googleCalendarId: userEmail,
        }}
      />
    </div>
  );
});

export default MyCalendar;
