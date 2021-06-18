const formatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
}).format(date);

const padLeadingZeros: (num: string, size: number) => string = (num, size) => {
  let str = num;
  while (str.length < size) {
    str = `0${str}`;
  }

  return str;
};

const newFormatDate = (date: Date) => new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
}).format(date);

export default { formatDate, padLeadingZeros, newFormatDate };
