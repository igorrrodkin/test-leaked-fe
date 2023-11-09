import moment from 'moment';

import addZero from '@/utils/addZero';

export interface ITime {
  hours: string,
  minutes: string,
  timesOfDay: 0 | 1
}

const hoursList = Array.from({ length: 12 }, (_, i) => (i + 1 < 10 ? `0${i + 1}` : String(i + 1)));
const minutesList = [...Array(60).keys()].map((el) => (el < 10 ? `0${el}` : String(el)));
const tod = ['AM', 'PM'];

const getCurrentTime = (timestamp?: string | number, isMinusOne?: boolean): ITime => {
  const date = timestamp ? moment(+timestamp).format('YYYY/MM/DD hh:mm A') : moment().format('YYYY/MM/DD hh:mm A');

  const hhmm = date.split(' ')[1];
  let hours = hhmm.split(':')[0];
  const minutes = hhmm.split(':')[1];
  const timesOfDay = date.split(' ')[2];

  if (timestamp && isMinusOne) {
    hours = addZero(+hours - 1);
  }

  const result = {
    hours,
    minutes,
    timesOfDay: timesOfDay === 'AM' ? 0 : 1,
  };

  return result as ITime;
};

export {
  hoursList, minutesList, tod, getCurrentTime,
};
