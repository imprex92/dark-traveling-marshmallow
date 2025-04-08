import { format, fromUnixTime, formatDistance, parseISO } from 'date-fns';
import PropTypes from 'prop-types';

// Supply with unix seconds

export default function DateFormatter({ timestamp, timeFromNow = false }) {
  if (typeof timestamp !== 'number') {
    console.error('DateFormatter error. Timestamp NaN');
    return <span>No date</span>;
  }

  return (
    <>
      {timeFromNow ? (
        <span>
          {format(fromUnixTime(timestamp), 'MMMM do yyyy')}, around
          {' ' +
            formatDistance(fromUnixTime(timestamp), new Date(), {
              addSuffix: true,
            })}
        </span>
      ) : (
        <span>{format(fromUnixTime(timestamp), 'MMMM do yyyy')}</span>
      )}
    </>
  );
}

export function ISODateFormatter({ timestamp, timeFromNow = false }) {
  let date;

  if (typeof timestamp === 'object' && timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    date = parseISO(timestamp); // Parse ISO string to Date object
  } else {
    console.error('ISODateFormatter error: Invalid timestamp');
    return <span>No date</span>;
  }

  const formattedDate = format(date, 'MMMM do yyyy');

  return (
    <span>
      {formattedDate}
      {timeFromNow &&
        `, around ${formatDistance(date, new Date(), { addSuffix: true })}`}
    </span>
  );
}

export function unixFormatter(timestamp) {
  return <>{format(fromUnixTime(timestamp), 'eeee, dd/MMM/yyyy')}</>;
}

ISODateFormatter.propTypes = {
  timeFromNow: PropTypes.bool,
  timestamp: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    .isRequired,
};
DateFormatter.propTypes = {
  timeFromNow: PropTypes.bool,
  timestamp: PropTypes.number.isRequired,
};

export function dateMMDDYY(timestamp) {
  return format(new Date(timestamp), 'MMddyy');
}
