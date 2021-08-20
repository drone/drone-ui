const getFullDateRepresentation = ({ date, dateOptions = {} }) => {
  const dateToRepresent = new Date(date * 1000);

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    hour12: true,
    minute: '2-digit',
    ...dateOptions,
  };

  return `${dateToRepresent.toLocaleDateString('en-US', options)}`;
};

export default getFullDateRepresentation;
