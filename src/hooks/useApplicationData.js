import {useState, useEffect} from "react";
import axios from "axios";

export default function useApplicationData() {
  const setDay = day => setState({ ...state, day });
  const [state, setState] = useState({
    day:"Monday",
    days: [],
    appointments: {},
    interviewers: []
  })
  const currentDay = state.days.find(day => day.name === state.day);
  const indexOfDay = state.days.findIndex(day => day.name === state.day);
  console.log("current Day1:",currentDay)

  const countSpotsForDay = (state, newAppointments) => {
    console.log("current Day2:",currentDay)
    const listOfAppointmentIds = currentDay.appointments;
    const listOfAppointmentSpots = listOfAppointmentIds.filter(
      id => !newAppointments[id].interview
      );
      const amountOfSpots = listOfAppointmentSpots.length;
      return amountOfSpots;
    }
    
    function bookInterview(id, interview) {
      const appointment = {
        ...state.appointments[id],
        interview: {...interview}
      };
      
      const appointments = {
        ...state.appointments,
        [id]: appointment
      };
      
      const spots = countSpotsForDay(state, appointments);
    console.log("spots:", countSpotsForDay(state, appointments))
      const day = {
        ...state.days[indexOfDay],
        spots: spots
      }
      const days = [...state.days];
      days.splice(indexOfDay, 1, day)
    
      return axios
        .put(`/api/appointments/${id}`, {interview})
        .then(() => setState({...state, appointments, days}))
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

    const spots = countSpotsForDay(state, appointments);
    console.log("spots:", countSpotsForDay(state, appointments))
    const day = {
      ...state.days[indexOfDay],
      spots: spots
    }
    const days = [...state.days];
    days.splice(indexOfDay, 1, day)

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => setState({...state, appointments, days}))
  }


  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    })
  }, [])
  
  return {state, setDay, bookInterview, cancelInterview};
}
