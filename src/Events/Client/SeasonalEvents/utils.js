
module.exports = {
  dateDiffInMS (startDate, endDate) {
    // console.log(startDate)
    // console.log(endDate)
    // const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information. This is for fully accurate bewteen timezones. We are only using UTC so should be fine
    // const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getTime);
    // const utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    // return Math.floor((utc2 - utc1));

    return Math.floor((endDate - startDate));
  }
}