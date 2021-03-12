import { get, writable } from 'svelte/store';

const mem = {};

function persist(key, value) {
  try {
    // if (window && window.sessionStorage) { typeof window === 'undefined'
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      mem[key] = value;
    }
  } catch (e) {
    console.log('persist err', e);
  }
}

// NB: sessionValue != 0 ...don't try to do that our you get the init
export function writableSession(key, initialValue) {
  let sessionValue;
  if (typeof window !== 'undefined') {
    let sv;
    try {
      sv = JSON.parse(window.sessionStorage.getItem(key));
    } catch (e) {
      console.log('channel session err', e);
    }
    sessionValue = sv;
  } else {
    sessionValue = mem[key];
  }

  if (!sessionValue) {
    persist(key, initialValue);
  }

  const store = writable(sessionValue || initialValue);
  store.subscribe((value) => persist(key, value));
  return store;
}
