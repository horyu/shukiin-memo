const lastAccessKey = 'lastAccess';
const hash = '#shukiin-memo'
const timecardURLwithHash = 'https://shukiin.com/timecard' + hash;

// 1分毎にイベントを発火
chrome.alarms.create('shukiinMemoEvent', {
  when: 1,
  periodInMinutes: 1
});

function update_last_access() {
  const todayDateString = (new Date()).toDateString();
  const obj = { [lastAccessKey]: todayDateString };
  chrome.storage.sync.set(obj, () => {
    console.log('save:', obj);
  });
}

function open_timecard() {
  window.open(timecardURLwithHash);
}

chrome.alarms.onAlarm.addListener((_alarm) => {
  const [todayDateString, dayNumKey] = ((d) => {
    return [d.toDateString(), d.getDay().toString()]
  })(new Date());
  chrome.storage.sync.get([lastAccessKey, dayNumKey], (obj) => {
    if (obj[lastAccessKey] !== todayDateString) {
      update_last_access();
      if (obj[dayNumKey]) {
        open_timecard();
      }
    }
  });
});
