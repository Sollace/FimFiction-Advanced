// ==UserScript==
// @name        Settings Manager
// @description Super Secret Stuff
// @version     4.3.1
// @author      Sollace
// @namespace   fimfiction-sollace
// @icon        https://raw.githubusercontent.com/Sollace/FimFiction-Advanced/master/logo.png
// @match       *://www.fimfiction.net/*
// @grant       none
// ==/UserScript==

const settingsMan = {
  __get: (key, parse, def) => settingsMan.has(key) ? parse(localStorage[key]) : def,
  keys: () => Object.keys(localStorage),
  has: key => localStorage[key] !== undefined,
  remove: key => localStorage.removeItem(key),
  get: (key, def) => settingsMan.__get(key, a => a, def),
  bool: (key, def) => settingsMan.__get(key, a => a == 'true' || a == '1' || !!a, def),
  int: (key, def) => settingsMan.__get(key, parseInt, def),
  float: (key, def) => settingsMan.__get(key, parseFloat, def),
  set: (key, val, def) => {
    if (def === undefined) def = '';
    if (val === def) return settingsMan.remove(key);
    localStorage[key] = val;},
  setB: (key, bool, def) => settingsMan.set(key, bool ? '1' : '', def),
  flag: (key, value) => {
    let current = (document.lastChild.getAttribute('FimFic_Adv') || '').split(',').filter(i => i != key && i != '');
    if (value) current.push(key);
    document.lastChild.setAttribute('FimFic_Adv', current.join(','));}
};
