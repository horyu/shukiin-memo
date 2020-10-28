const textId = 'text';
const hash = '#shukiin-memo'

function init() {
  chrome.storage.sync.get(textId, (items) => {
    console.log('load:', items);
    Object.entries(items).forEach(([_id, value]) => {
      start_modal_observer(value);
    });
    start_main_observer();
  });
}

// MutationObserverで監視してtextを設定する
function start_modal_observer(text) {
  const noteModalDiv = document.getElementById('timecard-edit-note-modal');
  const textarea = noteModalDiv.querySelector('textarea[name="note"]');
  const observer = new MutationObserver(() => {
    console.log('find textarea[name="note"]');
    if (textarea.value === '') {
      textarea.value = text;
      console.log('set memo:', text);
      noteModalDiv.querySelector('button').focus();
    }
    observer.disconnect();
  });
  const config = { attributes: true };
  observer.observe(noteModalDiv, config);
  console.log('wait for textarea[name="note"]');
}

// MutationObserverでメモを開くaタグの出現を待ってクリックする
function start_main_observer() {
  const mainDiv = document.getElementById('main');
  const dateString = (d => `${d.getMonth() + 1}/${d.getDate()}`)(new Date());
  const observer = new MutationObserver(() => {
    const tds = Array.from(document.querySelectorAll('td.js-date-column'));
    const td = tds.find(td => td.textContent.startsWith(dateString));
    if (td) {
      const tr = td.closest('tr');
      const a = tr && tr.querySelector('a.js-show-edit-note');
      if (a) {
        console.log('find a.js-show-edit-note');
        a.click();
        observer.disconnect();
      }
    }
  });
  const config = {
    childList: true,
    subtree: true 
  };
  observer.observe(mainDiv, config);
  console.log('wait for a.js-show-edit-note');
}

if (location.hash === hash) {
  init();
}
