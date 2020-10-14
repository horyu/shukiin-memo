const lastAccessKey = 'lastAccess';

const [todayDateString, dayNumKey] = ((d) => {
  return [d.toDateString(), d.getDay().toString()]
})(new Date());

