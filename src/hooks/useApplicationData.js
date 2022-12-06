import { useEffect, useReducer } from "react";
import axios from "axios";

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
        const currentDay = state.days.find(day => day.name === state.day);
        const indexOfDay = state.days.findIndex(day => day.name === state.day);
        const countSpotsForDay = (newAppointments) => {
          const listOfAppointmentIds = currentDay.appointments;
          const listOfAppointmentSpots = listOfAppointmentIds.filter(
            id => !newAppointments[id].interview
          );
          const amountOfSpots = listOfAppointmentSpots.length;
          return amountOfSpots;
        }
        const spots = countSpotsForDay(action.appointments);
        // console.log("spots:", countSpotsForDay(state, action.appointments))
        const day = {
          ...state.days[indexOfDay],
          spots: spots
        }
        const days = [...state.days];
        days.splice(indexOfDay, 1, day)
    
        return { ...state, appointments: action.appointments, days }
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
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios
      .put(`/api/appointments/${id}`, {interview})
      .then(() => dispatch({ type: SET_INTERVIEW, appointments}))
  }

  const cancelInterview = id => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, appointments}))
  }


  useEffect(() => {
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
  }, [])
  
  return {state, setDay, bookInterview, cancelInterview};
}
