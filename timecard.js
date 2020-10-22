const textId = 'text';
const hash = '#shukiin-memo'

let text;

function set_text() {
  let text = null;
  chrome.storage.sync.get(textId, (items) => {
    console.log('load:', items);
    Object.entries(items).forEach(([_id, value]) => {
      text = value;
    });
  });
}

// メモ帳はモーダルでじっくり出現するので、MutationObserverで監視してtextを設定する
function start_observer() {
  const noteModalDiv = document.getElementById('timecard-edit-note-modal');
  const textarea = noteModalDiv.querySelector('textarea[name="note"]');
  const observer = new MutationObserver(() => {
    if (textarea.value === '') {
      textarea.value = text;
      console.log('set memo:', text);
      noteModalDiv.querySelector('button').focus();
      observer.disconnect();
    }
  });
  const config = {
    attributes: true
  };
  observer.observe(noteModalDiv, config);
}

function clickMemo() {
  const dateString = (d => `${d.getMonth() + 1}/${d.getDate()}`)(new Date());
  const tds = Array.from(document.querySelectorAll('td.js-date-column'));
  const td = tds.find(td => td.textContent.startsWith(dateString));
  if (td) {
    const tr = td.closest('tr');
    const a = tr.querySelector('a.js-show-edit-note');
    if (a) {
      a.click();
      return true;
    }
  }
}

if (location.hash === hash) {
  set_text();
  start_observer();
  const intervalId = setInterval(() => {
    if (clickMemo()) {
      clearInterval(intervalId);
    }
  }, 100);
}
