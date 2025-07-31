import millisecondsToTime from "./millisecondsToTime";
import getCurrentDateTime from "./getCurrentDateTime";
import millisecondsToTextTime from "./millisecondsToTextTime";

const calculateTimeOnPage = (startTime, prefix, prefix2) => {
  const identifier = `cumulative${prefix}Duration`;
  const identifier3 = `timeOn${prefix2}`;
  const identifier4 = `lastAccess${prefix2}`;
  const identifier5 = `CumulativeTime${prefix2}`;

  let durationCumulative = localStorage.getItem(identifier) || 0;
  if (durationCumulative === undefined) {
    durationCumulative = 0;
  }

  const cumulativeDuration = +durationCumulative;
  let dateNow = Date.now();
  let newDurationCumulative = dateNow - startTime + cumulativeDuration;

  // send to state
  localStorage.setItem(identifier, newDurationCumulative);

  // send last access time to state
  const dateString = getCurrentDateTime();
  localStorage.setItem(identifier4, dateString);

  // send to memory
  const formattedDuration = millisecondsToTime(newDurationCumulative);
  localStorage.setItem(identifier3, formattedDuration);
  localStorage.setItem(identifier5, millisecondsToTextTime(newDurationCumulative));

  return;
};

export default calculateTimeOnPage;
