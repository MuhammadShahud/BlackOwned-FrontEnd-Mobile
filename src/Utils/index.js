import Storage from './AsyncStorage';

function getDates(startDate, endDate) {
  const dates = [];
  let currentDate = startDate;
  const addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  while (currentDate <= endDate) {
    dates.push(currentDate);
    currentDate = addDays.call(currentDate, 1);
  }
  return dates;
}

function numberToDoubleFigure(n) {
  return n > 9 ? '' + n : '0' + n;
}

async function getHeaders() {
  let token = await Storage.getToken();
  // console.warn('headers',token);
  return {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

export { getDates, numberToDoubleFigure, getHeaders };
