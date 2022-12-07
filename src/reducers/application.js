export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
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
      
      const updateSpots = function(state, appointments){
        const currentDay = state.days.find(day => day.name === state.day);
        const emptyAppointmentsForDay = currentDay.appointments.filter((id) => !appointments[id].interview);
        const emptySpots = emptyAppointmentsForDay.length;
        const updatedDay = {...currentDay, spots: emptySpots};
        const updatedDays = state.days.map(day => day.name === state.day ? updatedDay : day)
        return updatedDays
      };
      const days = updateSpots(state, appointments) ;
      return { ...state, appointments, days };
    }
  default:
    throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }
}

    // const currentDay = state.days.find(day => day.name === state.day);
    // const indexOfDay = state.days.findIndex(day => day.name === state.day);
    // const countSpotsForDay = (newAppointments) => {
    //   const listOfAppointmentIds = currentDay.appointments;
    //   const listOfAppointmentSpots = listOfAppointmentIds.filter(
    //     id => !newAppointments[id].interview
    //   );
    //   const amountOfSpots = listOfAppointmentSpots.length;
    //   return amountOfSpots;
    // }
    // const spots = countSpotsForDay(appointments);
    
    // const day = {
    //   ...state.days[indexOfDay],
    //   spots: spots
    // }
    // const days = [...state.days];
    // days.splice(indexOfDay, 1, day)