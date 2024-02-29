import "./index.css";

import React, { useState, useRef ,useEffect} from "react";

import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";

import MyCalendar from "./MyCalendar";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">
          X
        </button>
        {children}
      </div>
    </div>
  );
}

function App() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const calendarRef = useRef();

  const session = useSession();
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  async function googleSignIn() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    console.log(data);
    if (error) {
      console.error("Error logging in to Google provider with Supabase", error);
      alert(
        "Error logging in to Google provider with Supabase. Check the console for more information."
      );
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function createCalendarEvent() {
    setIsLoadingEvent(true);

    // Assuming start and end are in 'YYYY-MM-DDTHH:MM' format
    const startDateTime = new Date(start);
    const endDateTime = new Date(end);

    // Convert to ISO string format
    const startIsoString = startDateTime.toISOString();
    const endIsoString = endDateTime.toISOString();

    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: startIsoString,
        timeZone: "UTC",
      },
      end: {
        dateTime: endIsoString,
        timeZone: "UTC",
      },
    };

    fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("API Error:", data.error);
          throw new Error(`Google API Error: ${data.error.message}`);
        }
        console.log("Event Created:", data);
        alert("Event created successfully!");
      })
      .catch((error) => {
        console.error("Request Failed:", error);
        alert(`Failed to create event: ${error.message}`);
      })
      .finally(() => {
        setIsLoadingEvent(false); // Stop loading
        if (calendarRef.current) {
          calendarRef.current.refetchEvents();
        }
      });
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="flex justify-center items-center min-h-full my-5">
        {session ? (
          <>
            <div className="flex justify-around items-center min-w-full">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
            >
              Create Event
            </button>
            <button
                    onClick={signOut}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Sign Out
            </button>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">
                  Hey there {session.user.email}
                </h2>
                <div>
                  <label className="block">Start of your event</label>
                  <input
                    type="datetime-local"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block">End of your event</label>
                  <input
                    type="datetime-local"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block">Event name</label>
                  <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block">Event description</label>
                  <input
                    type="text"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => createCalendarEvent()}
                    className="mr-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Create Calendar Event
                  </button>
                 
                </div>
              </div>
            </Modal>
          </>
        ) : (
          <button
            onClick={googleSignIn}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 focus:outline-none"
          >
            Sign In With Google
          </button>
        )}
      </div>
      {isLoadingEvent && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-lg">Creating event...</div>
        </div>
      )}
      <div className="m-5">
        {session && (
          <MyCalendar ref={calendarRef} userEmail={session.user.email}/>
        )}
      </div>
    </>
  );
  
}

export default App;

