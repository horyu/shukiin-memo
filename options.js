'use strict';
// https://note.com/masarusuzuki/n/n4a3771029d52

const dateIds = [1, 2, 3, 4, 5, 6, 7].map(id => id.toString());
const textId = 'text';

function save_options() {
  const obj = { [textId]: document.getElementById(textId).value };
  dateIds.forEach(id => {
    obj[id] = document.getElementById(id).checked;
  });
  chrome.storage.sync.set(obj, () => {
    console.log('save:', obj);
  });
  window.alert('現在の設定を保存しました');
 }
 
 function restore_options() {
  chrome.storage.sync.get(dateIds, (items) => {
    console.log('load:', items);
    Object.entries(items).forEach(([id, checked]) => {
      document.getElementById(id).checked = checked;
    });
  });
  chrome.storage.sync.get(textId, (items) => {
    console.log('load:', items);
    Object.entries(items).forEach(([id, value]) => {
      document.getElementById(id).value = value;
    });
  });
 }

 document.addEventListener('DOMContentLoaded', restore_options);
 document.getElementById('save').addEventListener('click', save_options);