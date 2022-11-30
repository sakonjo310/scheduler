export function getAppointmentsForDay(state, day) {
  let appointmentsForDay = [];
  const filteredDay = state.days.filter(filtereday => filtereday.name === day);
  if (filteredDay.length === 0) return appointmentsForDay;
  const appArr = filteredDay[0].appointments;
  for (let appointment of appArr) {
    appointmentsForDay.push(state.appointments[appointment])
  }
  return appointmentsForDay;
}

export function getInterview(state, interview) {
  let interviewObj = {};
  if (!interview) return null;
  interviewObj.student = interview.student;
  const interviewerId = Object.keys(state.interviewers).filter(interviewer1 => Number(interviewer1) === interview.interviewer);
  const thisIneterviewer = state.interviewers[interviewerId];
  interviewObj.interviewer = thisIneterviewer;
  return interviewObj;
}