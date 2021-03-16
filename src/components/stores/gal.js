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
  devices: [],
};

let galCon;

function galStore() {
    let connect = () => { };
    let newUpStream = () => { };
    let disconnectStream = () => { };

  const setMediaChoices = async () => {
    let devices = [];
    try {
      devices = await navigator.mediaDevices.enumerateDevices();
    } catch (e) {
      console.error(e);
      return;
    }

    let cn = 1,
      mn = 1;

    devices.forEach((d) => {
      let label = d.label;
      if (d.kind === 'videoinput') {
        if (!label) label = `Camera ${cn}`;
        // addSelectOption(getSelectElement('videoselect'), label, d.deviceId);
        cn++;
      } else if (d.kind === 'audioinput') {
        if (!label) label = `Microphone ${mn}`;
        // addSelectOption(getSelectElement('audioselect'), label, d.deviceId);
        mn++;
      }
    });

    update((state) => {
      return { ...state, devices };
    });
  };

  if (typeof window !== 'undefined') {
    const HOME_SERVER = 'wss://jp2.the-faithful.com/ws';

    let galUser = 'anon';
    let galConnected = false;

    galCon = new GaleneProto.ServerConnection();
    galCon.onconnected = async (a) => {
      console.log('on connected', a);

      if (!mem.devices.length) {
        console.log('medica choices');
        await setMediaChoices();
      }

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
        setMedia(c, false);
        console.log('set media downtrack', {
          label,
          track,
          transceiver,
          stream,
          id: c.id,
          c,
        });
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
        setMediaStatus(c);
        console.log('setmediastatus');
      };
      c.onstats = (stats) => {
        console.log('stats', stats);
      };
      // if(getSettings().activityDetection)
      //     c.setStatsInterval(activityDetectionInterval);

      setMedia(c, false);
      console.log('setMedia ondownstream done');
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

    newUpStream = async (localId) => {
        console.log('new up', localId);
        let c = await galCon.newUpStream(localId);
        c.onstatus = function (status) {
          console.log('--new up status', { status });
          setMediaStatus(c);
        };
        c.onerror = function (e) {
          console.error(e);
          displayError(e);
        };
        c.onnegotiationcompleted = function () {
          console.log('neg completed');
          setMaxVideoThroughput(c, getMaxVideoThroughput());
        };
    
        return c;
      };
    
       disconnectStream = () => {
        galCon.close();
      };
          
    connect = async ({ userName }) => {
      try {
          if (galCon && galCon.socket) {
              console.log('----closing socket-----');
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

  const setMediaStatus = (c) => {
    let state = c && c.pc && c.pc.iceConnectionState;
    let good = state === 'connected' || state === 'completed';
    console.log({ good, localId: c.localId });
    let media = document.getElementById('media-' + c.localId);
    if (!media) {
      console.warn('Setting status of unknown media.');
      return;
    }
    if (good) {
      media.classList.remove('media-failed');
      if (c.userdata.play) {
        if (media instanceof HTMLMediaElement)
          media.play().catch((e) => {
            console.error(e);
            displayError(e);
          });
        delete c.userdata.play;
      }
    } else {
      media.classList.add('media-failed');
    }
  };

  const stopStream = (s) => {
    s.getTracks().forEach((t) => {
      try {
        console.log('stopping stream');
        t.stop();
      } catch (e) {
        console.warn(e);
      }
    });
  };

  async function setMaxVideoThroughput(c, bps) {
    let senders = c.pc.getSenders();
    console.log('senders');
    for (let i = 0; i < senders.length; i++) {
      let s = senders[i];
      if (!s.track || s.track.kind !== 'video') continue;
      let p = s.getParameters();
      if (!p.encodings) p.encodings = [{}];
      p.encodings.forEach((e) => {
        if (bps > 0) e.maxBitrate = bps;
        else delete e.maxBitrate;
      });
      try {
        await s.setParameters(p);
      } catch (e) {
        console.error(e);
      }
    }
  }

  const displayError = (e) => {
    window && window.pushToast && window.pushToast(e.message, 'alert');
  };

  function showVideo() {
    let width = window.innerWidth;
    let video_container = document.getElementById('video-container');
    video_container.classList.remove('no-video');
    if (width <= 768)
      document.getElementById('collapse-video').style.display = 'block';
  }

  function isSafari() {
    let ua = navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0;
  }

  /**
   * @param {boolean} [force]
   */
  function hideVideo(force) {
    let mediadiv = document.getElementById('peers');
    if (mediadiv.childElementCount > 0 && !force) return;
    let video_container = document.getElementById('video-container');
    video_container.classList.add('no-video');
    let left = document.getElementById('left');
    if (left.style.display !== 'none') {
      // hide all video buttons used to switch video on mobile layout
      closeVideoControls();
    }
  }

  function closeVideoControls() {
    // hide all video buttons used to switch video on mobile layout
    document.getElementById('switch-video').style.display = '';
    document.getElementById('collapse-video').style.display = '';
  }

  /**
   * @param {string} kind
   * @returns {Stream}
   */
  function findUpMedia(kind) {
    for (let id in serverConnection.up) {
      let c = serverConnection.up[id];
      console.log(`id findupmedia ${id} - kind ${c.kind} | ${kind}`);
      if (c.kind === kind) {
        return c;
      }
    }
    return null;
  }

  const setMedia = async (c, isUp, mirror, video) => {
    let peersdiv = document.getElementById('peers');

    let div = document.getElementById('peer-' + c.localId);
    if (!div) {
      div = document.createElement('div');
      div.id = 'peer-' + c.localId;
      div.classList.add('peer');
      peersdiv.appendChild(div);
    }

    let media = document.getElementById('media-' + c.localId); // type {HTMLVideoElement}
    if (media) {
      if (video) {
        throw new Error('Duplicate video');
      }
    } else {
      if (video) {
        media = video;
      } else {
        media = document.createElement('video');
        if (isUp) media.muted = true;
      }

      media.classList.add('media');
      media.autoplay = true;
      /** @ts-ignore */
      media.playsinline = true;
      media.id = 'media-' + c.localId;
      div.appendChild(media);
      //   if (!video) addCustomControls(media, div, c);
    }

    if (mirror) {
      media.classList.add('mirror');
    } else {
      media.classList.remove('mirror');
    }

    if (!video && media.srcObject !== c.stream) {
      media.srcObject = c.stream;
    }

    let label = document.getElementById('label-' + c.localId);
    if (!label) {
      label = document.createElement('div');
      label.id = 'label-' + c.localId;
      label.classList.add('label');
      div.appendChild(label);
    }

    // setLabel(c);
    setMediaStatus(c);

    showVideo();
    // resizePeers();

    if (!isUp && isSafari() && !findUpMedia('local')) {
      // Safari doesn't allow autoplay unless the user has granted media access
      try {
        let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (e) {}
    }
  };

  function getMaxVideoThroughput() {
    let v = 'low'; // TODO make config
    switch (v) {
      case 'lowest':
        return 150000;
      case 'low':
        return 300000;
      case 'normal':
        return 700000;
      case 'unlimited':
        return null;
      default:
        console.error('Unknown video quality', v);
        return 700000;
    }
  }

  return {
    subscribe,
    // addOne: () => update(n => n + 1),
    // reset: () => set(0)
    connect,
    newUpStream,
    setMediaStatus,
    setMedia,
    disconnectStream,
    //   delMedia, // ui, hide, cleanup
    stopStream,
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
