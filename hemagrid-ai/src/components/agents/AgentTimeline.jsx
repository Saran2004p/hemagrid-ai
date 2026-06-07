import {
  useEffect,
  useState
}
from "react";

import {
  getEvents
}
from "../../services/eventsApi";

import socket from "../../services/socket";

export default function AgentTimeline() {

  const [events,setEvents] =
    useState([]);

  useEffect(()=>{

    async function load() {

      const data =
        await getEvents();

      setEvents(data);
    }

    load();

    socket.on(
      "new-event",
      event => {

        setEvents(prev => [

          event,

          ...prev
        ]);
      }
    );

    return () => {

      socket.off(
        "new-event"
      );
    };

  },[]);

  return (

    <div className="
      bg-white
      rounded-xl
      p-6
      shadow-md
    ">

      <h2 className="
        text-xl
        font-bold
        mb-4
      ">
        AI Agent Timeline
      </h2>

      {

        events.map(event => (

          <div
            key={event.eventId}
            className="
              border-l-2
              border-red-500
              pl-4
              mb-4
            "
          >

            <p className="
              text-sm
              text-gray-500
            ">
              {
                new Date(
                  event.timestamp
                )
                .toLocaleTimeString()
              }
            </p>

            <p className="
              font-semibold
            ">
              {event.agent}
            </p>

            <p className="
              text-gray-700
            ">
              {event.message}
            </p>

          </div>
        ))
      }

    </div>
  );
}