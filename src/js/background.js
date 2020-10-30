import { TIMECARD_URL_WITH_HASH } from "./consts.js";

const LAST_ACCESS_KEY = 'lastAccess';

// 1分毎にイベントを発火
chrome.alarms.create('shukiinMemoEvent', {
  when: 1,
  periodInMinutes: 1
});

function update_last_access() {
  const todayDateString = (new Date()).toDateString();
  const obj = { [LAST_ACCESS_KEY]: todayDateString };
  chrome.storage.sync.set(obj, () => {
    console.log('save:', obj);
  });
}

function open_timecard() {
  window.open(TIMECARD_URL_WITH_HASH);
}

chrome.alarms.onAlarm.addListener((_alarm) => {
  const [todayDateString, dateKey] = ((d) => {
    return [d.toDateString(), d.getDay().toString()]
  })(new Date());
  chrome.storage.sync.get([LAST_ACCESS_KEY, dateKey], (obj) => {
    if (obj[LAST_ACCESS_KEY] !== todayDateString) {
      update_last_access();
      if (obj[dateKey]) {
        open_timecard();
      }
    }
  });
});
