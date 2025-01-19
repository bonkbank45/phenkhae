const removeTime = (date: string) => {
  return date.split(' ')[0];
};

const formatDateToThai = (dateString: string) => {
  const [date] = dateString.split(' '); // แยกส่วนเวลาออก
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const formatDateToString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// const parseDateObjectToStringISO = (date: Date): string => {
//   const [day, month, year] = date.toISOString().split('T')[0].split('-');
//   const [currentHour, currentMinute, currentSecond] = date
//     .toLocaleTimeString('th-TH', {
//       hour12: false,
//     })
//     .split(':');
//   console.log(
//     'After toISOString',
//     day,
//     month,
//     year,
//     currentHour,
//     currentMinute,
//     currentSecond,
//   );
//   return `${year}-${month.padStart(2, '0')}-${day.padStart(
//     2,
//     '0',
//   )} ${currentHour}:${currentMinute}:${currentSecond}`;
// };

export {
  removeTime,
  formatDateToThai,
  formatDateToString,
  // parseDateObjectToStringISO,
};
