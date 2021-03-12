<script>
  import { onMount } from 'svelte';
  import FirebaseProvider from '$components/FirebaseProvider.svelte';
  import { realtime } from '$components/stores/channel.js';

  let db;
  let firebase;
  let loaded = false;
  let user = {};
  let channels = {};

  // let thing = $token.val.keyName;

  const handleDbInit = async (ev) => {
    firebase = ev.detail.firebase;
    db = firebase.firestore();
  };

  let handleLogin = async (profile) => {
    if (!profile.detail) {
      console.log('not logged in.');
      window.location.href = '/?err=not+logged+in';
      return;
    }
    user = profile.detail.user;
    // console.log({ user });
    firebase = firebase || profile.detail.firebase;
    db = db || firebase.firestore();
  };

  onMount(() => {

    realtime.subscribe((rt) => {
      if (rt) {
        console.log('rt init', rt);
        try {
          // rt.connection.on('connected', function (ev) {
          //   console.log('realtime-connected!!');
          // });
          rt.connection.on('failed', function (ev) {
            console.log('failed realtime connection', ev);
          });

          channels.test = rt.channels.get('test');
          channels.test.subscribe(function (message) {
            console.log({data:message.data}, 'received');
          });
          // setInterval(()=>{
          //   channels.test.publish('eventTYpe?', {'my':Date.now()});
          // }, 2000);
        } catch (e) {
          console.log('rt-1', e);
        }
      }
    });
  });
</script>

<FirebaseProvider on:init={handleDbInit} on:auth-success={handleLogin}>
  <div class="m-6">
    <div class="pb-5 border-b border-gray-200">
      <h3
        class="pt-12 md:pt-24 text-3xl font-serif text-gray-900 font-extrabold tracking-tight sm:text-5xl"
      >
        Projector
      </h3>
    </div>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg m-auto p-12" />
  </div>
</FirebaseProvider>
