import { EXECUTION_DATE_KEY } from "./consts.js";

const LAST_ALARM_DATE_KEY = 'last-alarm-date';
const TIMECARD_URL = 'https://shukiin.com/timecard';

// 1分毎にイベントを発火
chrome.alarms.create('shukiinMemoEvent', {
  when: 1,
  periodInMinutes: 1
});

function update_last_alarm_date() {
  const todayDateString = (new Date()).toDateString();
  const obj = { [LAST_ALARM_DATE_KEY]: todayDateString };
  chrome.storage.sync.set(obj, () => {
    console.log('save:', obj);
  });
}

function update_execution_date(todayDateString, callback) {
  const obj = { [EXECUTION_DATE_KEY]: todayDateString };
  chrome.storage.sync.set(obj, () => {
    console.log('save:', obj);
    callback();
  });
}

chrome.alarms.onAlarm.addListener((_alarm) => {
  const [todayDateString, dateKey] = ((d) => {
    return [d.toDateString(), d.getDay().toString()]
  })(new Date());
  chrome.storage.sync.get([LAST_ALARM_DATE_KEY, dateKey], (obj) => {
    if (obj[LAST_ALARM_DATE_KEY] !== todayDateString) {
      update_last_alarm_date();
      if (obj[dateKey]) {
        update_execution_date(todayDateString, () => {
          chrome.tabs.create({ url: TIMECARD_URL });
        })
      }
    }
  });
});
