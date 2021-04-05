import { writable } from 'svelte/store';

// import { writableSession } from './utils';

// export const token = writableSession('channelToken', { val: '', ts: 0 });
export const realtime = writable(null, (set) => {
  if (typeof window !== 'undefined') {
    let authUrl =
      'https://us-central1-the-faithful.cloudfunctions.net/channelToken';

    if (window && window.location.href.indexOf('localhost') !== -1) {
      // dev mode
      authUrl = 'http://localhost:15001/the-faithful/us-central1/channelToken';
    }

    try {
      set(
        new window.Ably.Realtime({
          authUrl,
        })
      );

      // then we sit and spin, listening for events
      //   realtime.connection.on('connected', function (ev) {
      //     set({ type: 'connected', ev, realtime });
      //   });
      //   realtime.connection.on('error', function (ev) {
      //     set({ type: 'error', ev });
      //   });

      //set(ac);
    } catch (e) {
      console.log('realtime store error', e);
    }
  }
});

// const sendMessage = () => {
//   alert('mm');
// };

// export default {
//   subscribe: store.subscribe,
//   //   sendMessage,
// };
