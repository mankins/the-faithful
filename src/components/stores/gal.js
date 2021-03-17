import { derived, writable } from 'svelte/store';
import get from 'lodash.get';
import GaleneProto from '$components/utils/galene-protocol.js';
import vad from 'voice-activity-detection';

const MAX_CHAT_SIZE = 2;
const ROOM = 'faithful';

let defaultMem = {
  room: ROOM,
  state: 'boot',
  peers: {},
  chats: [],
  devices: [],
  myStream: {},
  downs: {},
  volumes: {},
  talking: {},
  talkerId: '', // speaker = talker
  talkerChange: 0, // last time we changed speaker
  me: {},
};

let mem = { ...defaultMem };
let galUser = 'anon';

const { subscribe, set, update } = writable(mem);

function galStore() {
  let connect = () => {};
  let newUpStream = () => {};
  let disconnectStream = () => {};
  let startStream = () => {};
  let stopStream = () => {};
  let initialize = () => {};
  let destroy = () => {
    console.log('warn default destroy');
  };
  let endStream = () => {
    console.log('---WARN endstream');
  };
  let setMediaStatus = () => {
    console.log('-----WARN---MEDIA-STATUS---');
  };

  let setMedia = () => {
    console.log('-0-WARN---setMedia---');
  };

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

  let galCon;
  let homeServer = 'wss://jp2.the-faithful.com/ws';

  destroy = async () => {
    if (typeof window == 'undefined') {
      return;
    }
    try {
      await galCon.close();
    } catch (e) {
      console.log('error destry', e);
    }
    set({ ...defaultMem });
    galCon = undefined;
    galUser = 'anon';
  };

  initialize = async () => {
    if (typeof window == 'undefined') {
      return;
    }
    if (galCon) {
      // already active
      //      console.log('re-using existing galcon');
      galCon = new GaleneProto.ServerConnection();
    } else {
      galCon = new GaleneProto.ServerConnection();
    }
    galCon.onconnected = async (a) => {
      console.log('on connected', a);

      if (!mem.devices.length) {
        console.log('media choices');
        await setMediaChoices();
      }

      await galCon.join(mem.room, galUser, '');
      await galCon.request('everything');

      update(() => {
        console.log('connected');
        mem.state = 'connected';
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
          // update((state) => {
          // });

          console.log('delMedia?', c.id, { peers: mem.peers });
        }
      };
      c.onerror = function (e) {
        console.error(e);
        window && window.pushToast && window.pushToast(e.message, 'alert');
      };
      c.ondowntrack = function (track, transceiver, label, stream) {
        // setMedia(c, false); 777
        console.log('set media downtrack', {
          label,
          track,
          transceiver,
          stream,
          id: c.id,
          c,
        });

        // get(mem.peers[c.source], `peers.${c.id}`, c);
        update((m) => {
          try {
            if (c.source && c.id && m.peers[c.source]) {
              c.userdata.peersUpdated = Date.now();
              let tmp = m.peers[c.source] || {};
              tmp.streams = tmp.streams || {};
              tmp.streams[c.source] = c;

              m.peers[c.source] = tmp;
            } else {
              console.log('cant find ${c.source}', m.peers);
            }
          } catch (e) {
            console.log('down c err', e);
          }
          return m;
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
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const vadOptions = {
          onVoiceStart: function () {
            // console.log('voice start - down', c.username);
            c.userdata.voiceStart = Date.now();
            update((m) => {
              m.talking[c.username] = m.talking[c.username] || {};
              m.talking[c.username].voiceStart = Date.now();
              return m;
            });
          },
          onVoiceStop: function () {
            // console.log('voice stop - down', c.username);
            c.userdata.voiceEnd = Date.now();
            update((m) => {
              if (m) {
                m.talking[c.username] = m.talking[c.username] || {};
                m.talking[c.username].voiceEnd = Date.now();
                return m;
              }
            });
            // stateContainer.innerHTML = 'Voice state: <strong>inactive</strong>';
          },
          onUpdate: function (val) {
            if (val) {
              // console.log('curr val: - down', val);///999
              c.userdata.voiceStrength = val;
              update((m) => {
                if (m) {
                  m.talking[c.username] = m.talking[c.username] || {};
                  m.talking[c.username].samples =
                    m.talking[c.username].samples || [];
                  let samples = m.talking[c.username].samples;
                  samples.push(val);
                  m.talking[c.username].samples = samples.slice(
                    Math.max(samples.length - 10, 0)
                  );
                  return m;
                }
              });
            }
            // valueContainer.innerHTML = 'Current voice activity value: <strong>' + val + '</strong>';
          },
        };
        try {
          vad(audioCtx, c.stream, vadOptions);
        } catch (e) {
          console.log('vad err down', e, c);
          try {
            setTimeout(async () => {
              await audioCtx.resume();
              vad(audioCtx, c.stream, vadOptions);
            }, 2000);
          } catch (ee) {
            console.log('vad err down 2', ee);
          }
        }
      };
      c.onstatus = function (status) {
        // setMediaStatus(c);
        c.userdata.setupMediaRequested = Date.now();
        console.log('setmediastatus');
      };
      c.onstats = (stats) => {
        console.log('stats', stats);
      };

      // if(getSettings().activityDetection)
      //     c.setStatsInterval(activityDetectionInterval);

      //setMedia(c, false);
      // console.log('setMedia would have been called ondownstream done');
      c.userdata.downstreamsUpdated = Date.now();
      update((m) => {
        m.downs[c.username || c.id] = { c }; // relaces old?
        return m;
      });
    };

    galCon.onuser = (id, kind, name) => {
      // console.log('onuser', { id, kind, name });
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
      // console.log('onchat', {
      //   peerId,
      //   dest,
      //   nick,
      //   time,
      //   privileged,
      //   kind,
      //   message,
      // });
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

    disconnectStream = () => {
      console.log('disconnect stream');
      galCon.close();
    };
  };

  endStream = (kind) => {
    // for (let id in serverConnection.up) {
    //   let c = serverConnection.up[id];
    //   if (kind && c.kind != kind) continue;
    update((m) => {
      console.log('trying to close', kind, m.myStream);
      if (m.myStream && m.myStream.c) {
        m.myStream.c.close();
        m.myStream = {};
      }
      // m.myStream = { c }; // relaces old?
      return m;
    });
  };

  newUpStream = async (localId) => {
    console.log('new up', localId);
    let c = await galCon.newUpStream(localId);
    c.onstatus = function (status) {
      console.log('--new up status', { status });
      update((m) => {
        m.me.up = m.me.up || {};
        m.me.up.status = status;
        return m;
      });

      c.userdata.status = status;
      // setMediaStatus(c);
      c.userdata.setupMediaRequested = Date.now();
    };
    c.onerror = function (e) {
      console.error(e);
      displayError(e);
    };
    c.onnegotiationcompleted = function () {
      // console.log('neg completed');
      setMaxVideoThroughput(c, getMaxVideoThroughput());
      c.username = c.username || galUser;
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      const vadOptions = {
        onVoiceStart: function () {
          // console.log('voice start - up', galUser);//666
          c.userdata.voiceStart = Date.now();
          update((m) => {
            m.talking[galUser] = m.talking[galUser] || {};
            m.talking[galUser].voiceStart = c.userdata.voiceStart;
            return m;
          });
          // stateContainer.innerHTML = 'Voice state: <strong>active</strong>';
        },
        onVoiceStop: function () {
          c.userdata.voiceEnd = Date.now();
          console.log('voice stop - up', galUser);
          update((m) => {
            m.talking[galUser] = m.talking[galUser] || {};
            m.talking[galUser].voiceEnd = c.userdata.voiceEnd;
            return m;
          });
          // stateContainer.innerHTML = 'Voice state: <strong>inactive</strong>';
        },
        onUpdate: function (val) {
          c.userdata.voiceStrength = val;
          if (val) {
            update((m) => {
              if (m) {
                m.talking[galUser] = m.talking[galUser] || {};
                m.talking[galUser].samples = m.talking[galUser].samples || [];
                let samples = m.talking[galUser].samples;
                samples.push(val);
                m.talking[galUser].samples = samples.slice(
                  Math.max(samples.length - 10, 0)
                );
                return m;
              }
            });
          }

          // console.log('curr val - up:', val);
          // valueContainer.innerHTML = 'Current voice activity value: <strong>' + val + '</strong>';
        },
      };
      vad(audioCtx, c.stream, vadOptions);
      update((m) => {
        try {
          c.userdata.peersUpdated = Date.now();
          let tmp = m.peers[galUser] || {};
          tmp.streams = tmp.streams || {};
          tmp.name = galUser;
          tmp.id = c.id;
          tmp.streams[c.id] = c; // galUser??

          m.peers[c.id] = tmp; // ? galUser
          console.log({ galUser, peers: m.peers });
        } catch (e) {
          console.log('down c err', e);
        }
        return m;
      });
    };

    return c;
  };

  startStream = async ({ localId, mute = false }) => {
    update((m) => {
      m.me.up = m.me.up || {};
      m.me.up.status = 'init';
      return m;
    });

    let video = {};
    // video.width = { min: 640, ideal: 1920 };
    // video.height = { min: 400, ideal: 1080 };

    let audio = true;

    let constraints = { video, audio };

    let stream = null;

    stream = await navigator.mediaDevices.getUserMedia(constraints); // will throw err on fail

    console.log('---start upstream---', localId); // 888
    let c = await newUpStream(localId); // throws on err
    c.kind = 'local';
    c.stream = stream;

    c.onclose = (replace) => {
      console.log('closing stream', { stream: c.stream, replace });
      stopStream(c.stream);
      if (!replace) {
        // Gal.delMedia(c.localId);
        // TODO: cleanup ui?
      }
    };

    c.stream.getTracks().forEach((t) => {
      c.labels[t.id] = t.kind;
      if (t.kind == 'audio') {
        if (mute) {
          t.enabled = false;
        }
      } else if (t.kind == 'video') {
        // if(settings.blackboardMode) {
        //     /** @ts-ignore */
        //     t.contentHint = 'detail';
        // }
      }
      c.pc.addTrack(t, stream);
    });
    // await Gal.setMedia(c, true, mirrorView);
    // console.log({ c }, '!!');
    // console.log('set media done');
    update((m) => {
      m.myStream = { c }; // relaces old?
      m.me.up = m.me.up || {};
      m.me.up.status = 'started';
      return m;
    });
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
      await galCon.connect(homeServer);
      console.log('connected');
      mem.state = 'connected';
    } catch (e) {
      console.error(`gal err: ${e.message}`);
      // displayError(e.message ? e.message : "Couldn't connect to " + url);
    }
  };

  // setMediaStatus = (c) => {
  //   let state = c && c.pc && c.pc.iceConnectionState;
  //   let good = state === 'connected' || state === 'completed';
  //   console.log({ good, localId: c.localId });
  //   let media = document.getElementById('media-' + c.localId);
  //   if (!media) {
  //     console.warn('Setting status of unknown media.');
  //     return;
  //   }
  //   if (good) {
  //     media.classList.remove('media-failed');
  //     if (c.userdata.play) {
  //       if (media instanceof HTMLMediaElement)
  //         media.play().catch((e) => {
  //           console.error(e);
  //           displayError(e);
  //         });
  //       delete c.userdata.play;
  //     }
  //   } else {
  //     media.classList.add('media-failed');
  //   }
  // };

  stopStream = (s) => {
    let status = 'stopping';
    s.getTracks().forEach((t) => {
      try {
        console.log('stopping stream');
        t.stop();
        status = 'stopped';
      } catch (e) {
        console.warn(e);
        status = 'stoperr';
      }
    });
    update((m) => {
      m.me.up = m.me.up || {};
      m.me.up.status = status;
      return m;
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

  setMedia = async (c, isUp, mirror, video) => {
    console.log('=-=-=-=-=-=setMedia?');
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
    c.userdata.setupMediaRequested = Date.now(); //     setMediaStatus(c);

    // showVideo();
    // resizePeers();

    if (!isUp && isSafari() && !findUpMedia('local')) {
      // Safari doesn't allow autoplay unless the user has granted media access
      try {
        let stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        stream.getTracks().forEach((t) => t.stop());
      } catch (e) {}
    }
  };

  function getMaxVideoThroughput() {
    let v = 'lowest'; // TODO make config
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
    destroy,
    initialize,
    endStream,
    connect,
    newUpStream,
    setMediaStatus,
    // setMedia,
    startStream,
    disconnectStream,
    //   delMedia, // ui, hide, cleanup
    stopStream,
  };
}

const getPeers = (m) => {
  return m.peers;
};

const getDowns = (m) => {
  return m.downs;
};

const getChats = (m) => {
  return m.chats;
};

const getTalking = (m) => {
  return m.talking;
};

const getWhoIsTalking = (m) => {
  const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

  let lastStartedTalking = 0;
  let talker = m.talkerId; // default to the old
  let talkers = {};
  let MIN_MIC_TIME = 1500;

  if (Date.now() - m.talkerChange < MIN_MIC_TIME) {
    return talker; // no change, they just got the mic
  }

  Object.keys(m.talking).forEach((participantId) => {
    let participant = m.talking[participantId] || {};
    // console.log(JSON.stringify(participant,null,1));
    let started = get(participant, 'voiceStart', 0);
    if (started > lastStartedTalking) {
      // talking - take average of sample
      let sample = participant.samples || [];
      let energy = average(sample) || 0;
      talkers[participantId] = energy;
    }
  });

  let maxEnergy = 0;
  Object.keys(talkers).forEach((participantId) => {
    let energy = talkers[participantId] || 0;
    if (energy > maxEnergy) {
      // if it's us and we don't have the video on, pretent it's not us
      if (!(participantId === galUser && get(m, 'me.up.status') !== 'connected')) {
        talker = participantId;
        maxEnergy = energy;  
      } else {
        // console.log('skipping us', participantId);
      }
    }
  });

  if (m.talkerId !== talker) {
    m.talkerChange = Date.now();
  }

  m.talkerId = talker || '';

  // console.log({ talker, talkers });
  return talker;
};

const getMe = (m) => {
  // do you?
  return m.me;
};

export const gal = galStore();
export const peers = derived(gal, ($galStore) => getPeers($galStore));
export const downs = derived(gal, ($galStore) => getDowns($galStore));
export const chats = derived(gal, ($galStore) => getChats($galStore));
export const talking = derived(gal, ($galStore) => getTalking($galStore));
export const talker = derived(gal, ($galStore) => getWhoIsTalking($galStore));
export const me = derived(gal, ($galStore) => getMe($galStore));
