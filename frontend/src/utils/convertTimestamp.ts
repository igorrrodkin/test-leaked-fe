import moment from 'moment';

export default (
  timestamp: number | string,
  withHours: boolean = false,
  withSeconds: boolean = false,
) => {
  const date = moment(+timestamp).format('YYYY/MM/DD hh:mm:ss A');
  const ymd = date.split(' ')[0];
  const hhmm = date.split(' ')[1];

  const hours = hhmm.split(':')[0];
  const minutes = hhmm.split(':')[1];
  const seconds = hhmm.split(':')[2];
  const timesOfDay = date.split(' ')[2];
  const day = ymd.split('/')[2];
  const month = ymd.split('/')[1];
  const year = ymd.split('/')[0];

  return withSeconds
    ? `${hours}:${minutes}:${seconds} ${timesOfDay} \n ${day}/${month}/${year}`
    : withHours
    ? `${hours}:${minutes} ${timesOfDay} \n ${day}/${month}/${year}`
    : `${day}/${month}/${year}`;
};
