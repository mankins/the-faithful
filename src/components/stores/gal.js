import { derived, writable } from 'svelte/store';
import get from 'lodash.get';
import GaleneProto from '$components/utils/galene-protocol.js';
// import { shortId } from '../utils/short-uuid';

const { subscribe, set, update } = writable(0);

const MAX_CHAT_SIZE = 2;
const ROOM = 'faithful';

let mem = {
  room: ROOM,
  peers: {},
  chats: [],
};

function galStore() {
  let connect = () => {};

  if (typeof window !== 'undefined') {
    const HOME_SERVER = 'wss://jp2.the-faithful.com/ws';
    const GROUP = 'faithful';

    let galUser = 'anon';
    let galConnected = false;

    const galCon = new GaleneProto.ServerConnection();
    galCon.onconnected = async (a) => {
      console.log('on connected', a);

      await galCon.join(ROOM, galUser, '');
      await galCon.request('everything');

      update(() => {
        mem.con = 'connected';
        return { ...mem };
      });
    };

    galCon.onclose = (code, reason) => {
      console.log('onclose', { code, reason });
      update((state) => {
        return { ...state, con: 'closed', reason: reason };
      });
    };

    galCon.ondownstream = (c) => {
      console.log('ondownstream', { c });
      c.onclose = function (replace) {
        if (!replace) {
          //delMedia(c.localId);
          console.log('delMedia?');
        }
      };
      c.onerror = function (e) {
        console.error(e);
        window && window.pushToast && window.pushToast(e.message, 'alert');
      };
      c.ondowntrack = function (track, transceiver, label, stream) {
        //setMedia(c, false);
        console.log('set media down');
      };
      c.onnegotiationcompleted = function () {
        let found = false;
        for (let key in c.labels) {
          if (c.labels[key] === 'video') found = true;
        }
        if (!found) {
          // resetMedia(c);
          console.log('reset media todo');
        }
      };
      c.onstatus = function (status) {
        //setMediaStatus(c);
        console.log('setmediastatus todo');
      };
      c.onstats = (stats) => {
        console.log('stats', stats);
      };
      // if(getSettings().activityDetection)
      //     c.setStatsInterval(activityDetectionInterval);

      //    setMedia(c, false);
      console.log('setMedia todo');
    };

    galCon.onuser = (id, kind, name) => {
      console.log('onuser', { id, kind, name });
      switch (kind) {
        case 'add':
          if (!get(mem, `peers.${id}`, '')) {
            mem.peers[id] = { id, name };
          }
          break;
        case 'delete':
          delete mem.peers[id];
          break;
        default:
          console.warn('Unknown user kind', kind);
          break;
      }

      update(() => {
        return { ...mem };
      });
    };
    galCon.onjoined = (kind, group, perms, message) => {
      console.log('onjoined', { kind, group, perms, message });
    };
    galCon.onchat = (peerId, dest, nick, time, privileged, kind, message) => {
      console.log('onchat', {
        peerId,
        dest,
        nick,
        time,
        privileged,
        kind,
        message,
      });
      let chatsTmp = mem.chats;
      chatsTmp.push({ peerId, dest, nick, time, privileged, kind, message });
      if (chatsTmp.length > MAX_CHAT_SIZE) {
        chatsTmp.shift(); // remove first
      }
      mem.chats = chatsTmp;
      update(() => {
        return { ...mem };
      });
    };
    galCon.onusermessage = (
      id,
      dest,
      username,
      time,
      privileged,
      kind,
      message
    ) => {
      console.log('onusermessage', {
        id,
        dest,
        username,
        time,
        privileged,
        kind,
        message,
      });
    };

    connect = async ({ userName }) => {
      try {
        if (galCon && galCon.socket) {
          galCon.close();
        }

        if (userName) {
          galUser = userName;
        }

        console.log('connecting to gal');
        await galCon.connect(HOME_SERVER);
        console.log('connected');
      } catch (e) {
        console.error(`gal err: ${e.message}`);
        // displayError(e.message ? e.message : "Couldn't connect to " + url);
      } finally {
        galConnected = true;
      }
    };

    //             gal.send({
    // type: 'chat',
    // kind: '',// or 'me',
    // // source: 'source-id',
    // // username: 'me',
    // username: galUser,
    // dest: '', // empty = everyone
    // // privileged: false,
    // noecho: false,
    // value: 'hey!'
    // });

    // gal.send({
    // type: 'usermessage',
    // kind: '',// or 'me',
    // // source: 'source-id',
    // // username: 'me',
    // username: galUser,
    // dest: '', // empty = everyone
    // // privileged: false,
    // noecho: false,
    // value: {'time':Date.now()}
    // });

    // gal.chat('matt', nick, peerId, 'hi?');
  }
  return {
    subscribe,
    // addOne: () => update(n => n + 1),
    // reset: () => set(0)
    connect,
  };
}

// Use it like a regular store
// galStore.subscribe(console.log)
// galStore.addOne()

const getPeers = (m) => {
  return m.peers;
};

const getChats = (m) => {
  return m.chats;
};

export const gal = galStore;
export const peers = derived(galStore(), ($galStore) => getPeers($galStore));
export const chats = derived(galStore(), ($galStore) => getChats($galStore));
