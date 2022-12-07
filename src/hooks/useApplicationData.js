import { useEffect, useReducer } from "react";
import axios from "axios";

const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day }
      case SET_APPLICATION_DATA:
        return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
      case SET_INTERVIEW: {
        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview ? {...action.interview} : null
        };
        
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
        console.log("appointments:", appointments)
        const currentDay = state.days.find(day => day.name === state.day);
        const indexOfDay = state.days.findIndex(day => day.name === state.day);
        const countSpotsForDay = (newAppointments) => {
          // console.log(currentDay)
          // console.log("newApp:", newAppointments)
          const listOfAppointmentIds = currentDay.appointments;
          const listOfAppointmentSpots = listOfAppointmentIds.filter(
            id => !newAppointments[id].interview
          );
          const amountOfSpots = listOfAppointmentSpots.length;
          return amountOfSpots;
        }
        // console.log("action:", action)
        const spots = countSpotsForDay(appointments);
        
        // console.log("spots:", countSpotsForDay(state, action.appointments))
        const day = {
          ...state.days[indexOfDay],
          spots: spots
        }
        const days = [...state.days];
        days.splice(indexOfDay, 1, day)
    
        return { ...state, appointments, days }
      }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

  const setDay = day => dispatch({ type: SET_DAY, day });

  const [state, dispatch] = useReducer(reducer, {
    day:"Monday",
    days: [],
    appointments: {},
    interviewers: []
  })
      
  function bookInterview(id, interview) {
    
    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview}))
  }

  const cancelInterview = id => {
    
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null}))
  }


  useEffect(() => {
    webSocket.onmessage = function (event) {
      // console.log("Event data", event.data)
      const { id, interview, appointments } = JSON.parse(event.data)
      dispatch({ type: SET_INTERVIEW, id, interview, appointments})
    }
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      })
    })
    return () => webSocket.close();
  }, [])
  
  return {state, setDay, bookInterview, cancelInterview};
}
