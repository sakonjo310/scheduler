import { useEffect, useReducer } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";


export default function useApplicationData() {

/// Set the current day ///  
  const setDay = day => dispatch({ type: SET_DAY, day });

/// Set states ///
  const [state, dispatch] = useReducer(reducer, {
    day:"Monday",
    days: [],
    appointments: {},
    interviewers: []
  })

/// Book interview function  
  function bookInterview(id, interview) {
    return axios
    .put(`/api/appointments/${id}`, {interview})
    .then(() => dispatch({ type: SET_INTERVIEW, id, interview}))
  }

/// Cancel interveiw function  
  const cancelInterview = id => {
    return axios
    .delete(`/api/appointments/${id}`)
    .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null}))
  }
  
/// Axios request to the server ///  
  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    webSocket.onmessage = function (event) {
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
