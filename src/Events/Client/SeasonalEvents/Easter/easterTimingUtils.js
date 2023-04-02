const { dateDiffInMS } = require("../utils");

const DATE_BACK_OFFSET = (24 * 60 * 60 * 1000) * 5; //5 days
const DATE_FORWARD_OFFSET = (24 * 60 * 60 * 1000) * 1; //1 day
const NUMBER_OF_EVENTS = 1

const getEasterDayDate = (year = new Date().getFullYear()) => {
  const C = Math.floor(year / 100);
  const N = year - 19 * Math.floor(year / 19);
  const K = Math.floor((C - 17) / 25);
  let I = C - Math.floor(C / 4) - Math.floor((C - K) / 3) + 19 * N + 15;
  I = I - 30 * Math.floor((I / 30));
  I = I - Math.floor(I / 28) * (1 - Math.floor(I / 28) * Math.floor(29 / (I + 1)) * Math.floor((21 - N) / 11));
  let J = year + Math.floor(year / 4) + I + 2 - C + Math.floor(C / 4);
  J = J - 7 * Math.floor(J / 7);
  const L = I - J;
  var month = 3 + Math.floor((L + 40) / 44);
  var day = L + 28 - 31 * Math.floor(month / 4);

  return new Date(month + '/' + day + '/' + year) //Need to swap month and day here to get correct date
  // return new Date() // For testing
}

const getEventDates = () => {
  const easterDayDateCurrentYear = getEasterDayDate()
  const easterEventStartDateCurrentYear = new Date(new Date().setTime(easterDayDateCurrentYear.getTime() - DATE_BACK_OFFSET));
  const easterEventEndDateCurrentYear = new Date(new Date().setTime(easterDayDateCurrentYear.getTime() + DATE_FORWARD_OFFSET));

  const easterDayDateNextYear = getEasterDayDate(new Date().getFullYear() + 1)
  const easterEventStartDateNextYear = new Date(new Date().setTime(easterDayDateNextYear.getTime() - DATE_BACK_OFFSET));
  const easterEventEndDateNextYear = new Date(new Date().setTime(easterDayDateNextYear.getTime() + DATE_FORWARD_OFFSET));

  return { easterDayDateCurrentYear, easterEventStartDateCurrentYear, easterEventEndDateCurrentYear, easterDayDateNextYear, easterEventStartDateNextYear, easterEventEndDateNextYear }
}

module.exports = {
  easterEventTimingDetails (client, server) {
    currentDate = new Date()
    let { easterDayDateCurrentYear, easterEventStartDateCurrentYear, easterEventEndDateCurrentYear, easterDayDateNextYear, easterEventStartDateNextYear, easterEventEndDateNextYear } = getEventDates()
    let msUntilEventStart = 10000;
    let msUntilEventEnd = null;
    let msUntilNextStartOrEnd = 10000
    let isEventOver = false;
    let isEventUpcoming = false
    // Checks if current years event is over, if it is use next years start date
    if (Math.floor(currentDate) > Math.floor(easterEventEndDateCurrentYear)) {
      isEventOver = true;
      msUntilEventStart = dateDiffInMS(currentDate, easterEventStartDateNextYear)
      msUntilEventEnd = dateDiffInMS(currentDate, easterEventEndDateNextYear) + 10000
    } else if (Math.floor(currentDate) < Math.floor(easterEventStartDateCurrentYear)) {
      isEventUpcoming = true
      msUntilEventStart = dateDiffInMS(currentDate, easterEventStartDateCurrentYear)
      msUntilEventEnd = dateDiffInMS(currentDate, easterEventEndDateCurrentYear) + 10000
    } else {
      msUntilEventEnd = dateDiffInMS(currentDate, easterEventEndDateCurrentYear) + 10000
    }

    if (isEventOver || isEventUpcoming) {
      // Current date is after this years Easter End or before this years start
      msUntilNextStartOrEnd = msUntilEventStart
    } else {
      // Wait to call this again when event is over, call the event calls again and stop the events
      msUntilNextStartOrEnd = msUntilEventEnd
    }
    return { msUntilNextStartOrEnd, msUntilEventStart, msUntilEventEnd, isEventOver, isEventUpcoming }
  }
}