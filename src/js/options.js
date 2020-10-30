'use strict';
// https://note.com/masarusuzuki/n/n4a3771029d52
import { MEMO_TEXT_ID } from "./consts.js";

const OPTION_HTML_TEXTAREA_ID = 'option-html-textarea';
const OPTION_HTML_DATE_ID_PREFIX = 'option-html-date-';

const dateIds = [1, 2, 3, 4, 5, 6, 7].map(id => id.toString());

function restore_options() {
  chrome.storage.sync.get(dateIds, (items) => {
    console.log('load:', items);
    Object.entries(items).forEach(([id, checked]) => {
      document.getElementById(OPTION_HTML_DATE_ID_PREFIX + id).checked = checked;
    });
  });
  chrome.storage.sync.get(MEMO_TEXT_ID, (items) => {
    console.log('load:', items);
    Object.entries(items).forEach(([id, value]) => {
      document.getElementById(OPTION_HTML_TEXTAREA_ID).value = value;
    });
  });
}

function save_options() {
  const obj = { [MEMO_TEXT_ID]: document.getElementById(OPTION_HTML_TEXTAREA_ID).value };
  dateIds.forEach(id => {
    obj[id] = document.getElementById(OPTION_HTML_DATE_ID_PREFIX + id).checked;
  });
  chrome.storage.sync.set(obj, () => {
    console.log('save:', obj);
    window.alert('現在の設定を保存しました');
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);