<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { browser } from '$app/environment';

  import firebasePromise from '$lib/utils/firebase';
  import { shortId } from '$lib/utils/short-uuid';
  import { sendEvent } from '$lib/utils/events';

  export let logout = false;

  const dispatch = createEventDispatcher();

  export const actions = {};
  let firebase;

  onMount(async () => {
    if (!browser) {
      return;
    }

    firebase = await firebasePromise;

    dispatch('init', { firebase });
    try {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } catch (e) {
      console.log('persistence local not available', e);
    }
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        // console.log({ user }, 'aaa');
        if (user && !user.isAnonymous) {
          if (user.email) {
            window.Sentry && window.Sentry.setUser({ email: user.email });
          }

          dispatch('auth-success', { user, firebase });
        } else {
          if (user.uid) {
            window.Sentry && window.Sentry.setUser({ id: user.uid });
          }

          dispatch('auth-success-anonymous', { user, firebase });
        }
      } else {
        console.log('auth-failure');
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {
            // Signed in..
            dispatch('auth-success-anonymous', { user, firebase });
            console.log('signed in anonymously');
          })
          .catch((error) => {
            console.error({ error });
            dispatch('auth-failure', { firebase, error });
          });
      }
    });
    actions.forgotPassword = async (email) => {
      if (!email) {
        window.pushToast('Please fill out your email first.', 'alert');
        return;
      }

      return firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function () {
          // Email sent.
          window.pushToast(
            'Ok, check your email for your forgot password link.',
            'info'
          );
        })
        .catch(function (error) {
          // An error happened.
          window.pushToast(`Unable to reset email. ${error.message}`, 'alert');
        });
    };
    actions.clickMagicLinkSignin = async (email, onAuth = '/my') => {
      sendEvent({ topic: 'user.login.started', email, type: 'magic' });

      const actionCodeSettings = {
        url: `${window.location.origin}/magic?next=${encodeURIComponent(
          onAuth
        )}`,
        handleCodeInApp: true,
      };

      return firebase
        .auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(() => {
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          window.localStorage.setItem('emailForSignIn', email);
          window.pushToast(
            `Single-use sign in email sent. Click on the link in your email to login.`,
            'success'
          );
        })
        .catch((error) => {
          window.pushToast(`Unable to send email. ${error.message}`, 'alert');
          sendEvent({ topic: 'user.login.error', email, type: 'magic' });
        });
    };
    actions.clickUserPassSignup = async (email, password) => {
      if (!(email && password)) {
        window.pushToast('Email and password required', 'alert');
        return false;
      }

      const auth = firebase.auth();

      try {
        const usercred = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        console.log('Account signup success', usercred.user);
        return actions.loginAction(usercred, 'password');
      } catch (e) {
        console.log('error linking', e);
        if (e.code === 'auth/email-already-in-use') {
          return actions.clickUserPassSignin(email, password);
          // window.pushToast(
          //   "Email already in use. Try a different way to authenticate.",
          //   "alert"
          // );
        } else {
          // auth/invalid-email
          window.pushToast(`Error: ${e.message}`, 'alert');
        }
      }

      return false;
    };

    actions.clickUserPassSignin = async (email, password) => {
      console.log({ email, password });
      if (!(email && password)) {
        window.pushToast('Email and password required', 'alert');
        return false;
      }

      //     if (loggedIn) {
      //   console.log("user already logged in?");
      //   return;
      // }

      const auth = firebase.auth();
      //    const anonymousUser = auth.currentUser;

      try {
        const usercred = await auth.signInWithEmailAndPassword(email, password);
        console.log('Account signin success', usercred.user);
        return actions.loginAction(usercred, 'password');
      } catch (e) {
        console.log('error linking', e);
        if (e.code === 'auth/email-already-in-use') {
          window.pushToast(
            'Email already in use. Try a different way to authenticate.',
            'alert'
          );
        } else {
          // auth/invalid-email
          window.pushToast(`Error: ${e.message}`, 'alert');
        }
      }

      return false;
    };

    actions.loginAction = async (result, providerId) => {
      const user = JSON.parse(JSON.stringify(result.user));
      // check if we know about this user already, if not, add user details
      const db = firebase.firestore();
      console.log(JSON.stringify(user, null, 2));
      const docRef = db.collection('users').doc(user.uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        await db.doc(`users/${user.uid}`).set({
          email: `${user.email}`,
          displayName: `${user.displayName}`,
          photoURL: `${user.photoURL}`,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
          providerId: `${providerId}`,
          uid: `${user.uid}`,
        });
      } else {
        const newDoc = {
          email: `${user.email}`,
          displayName: `${user.displayName}`,
          photoURL: `${user.photoURL}`,
          //                providerData: {...user.providerData},
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
          emailVerified: user.emailVerified,
          providerId: `${providerId}`,
          uid: `${user.uid}`,
        };
        await db.doc(`users/${user.uid}`).update(newDoc);
      }

      dispatch('auth-success-action', {
        user,
        provider: providerId,
      });
    };

    actions.doLogin = async (provider, providerId) => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          return actions.loginAction(result, providerId);
        })
        .catch((error) => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            window.pushToast(
              'Email already in use. Try a different way to authenticate.',
              'alert'
            );
          } else {
            console.log(error, 'auth');
            if (error.code !== 'auth/popup-closed-by-user') {
              window.pushToast(`Error logging in: ${error.message}`, 'alert');
              dispatch('auth-failure', { error });
            }
          }
        });
    };

    actions.clickGoogleSignin = async () => {
      console.log('goog signin');
      const provider = new firebase.auth.GoogleAuthProvider();
      await actions.doLogin(provider, 'google');
    };

    actions.clickTwitterSignin = async () => {
      console.log('twitter signin');
      const provider = new firebase.auth.TwitterAuthProvider();
      await actions.doLogin(provider, 'twitter');
    };

    actions.clickFacebookSignin = async () => {
      console.log('fb signin');
      const provider = new firebase.auth.FacebookAuthProvider();
      await actions.doLogin(provider, 'facebook');
    };

    actions.clickAccessSignin = async (email, nextUrl = '/my', waitFn) => {
      if (!email) {
        window.pushToast('Please enter an email first.', 'alert');
        return;
      }

      sendEvent({ topic: 'user.login.started', email, type: 'code' });
      let accessCode = prompt('Enter access code digits', '');

      if (accessCode) {
        waitFn(true);
        const accessCodeFn = firebase.functions().httpsCallable('accessCode');
        try {
          const reply = await accessCodeFn({ email, accessCode });
          const authResponse = reply.data;
          // console.log(JSON.stringify({ authResponse }));
          if (authResponse && authResponse.firebaseToken) {
            const userCredential = await firebase
              .auth()
              .signInWithCustomToken(authResponse.firebaseToken);
            // console.log(JSON.stringify({ userCredential: JSON.stringify(userCredential) }));
            sendEvent({ topic: 'user.login.success', email, type: 'code' });
          }

          waitFn(false);
          window.location.href = nextUrl || '/';
        } catch (error) {
          console.log('err access code', error);
          window.pushToast(`Error with access code: ${error.message}`, 'alert');
          waitFn(false);
          dispatch('auth-failure', { error });
          return;
        }
      } else {
        window.pushToast(`Access code login requires code.`, 'info');
      }
      waitFn(false);
    };

    actions.clickCoilSignin = async (nextUrl) => {
      console.log('coil signin!');
      sendEvent({ topic: 'user.login.started', type: 'coil' });

      const redirectUri = `${window.location.origin}/oauth/authorize`;
      const cookieState = shortId();
      document.cookie = `_oauth_state=${cookieState}; path=/`;
      document.cookie = `_oauth_redir=${encodeURIComponent(nextUrl)}; path=/`;

      window.location.href = `https://coil.com/oauth/auth?response_type=code&scope=${encodeURIComponent(
        'simple_wm openid email'
      )}&client_id=7d90b18a-2c64-4769-8ecf-63d1101f6e45&state=${cookieState}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;
    };

    // dispatch any params
    if (logout) {
      sendEvent({ topic: 'user.logout' });

      firebase
        .auth()
        .signOut()
        .then(function () {
          dispatch('auth-logout-success', true);
        })
        .catch((e) => {
          console.error(e);
          dispatch('auth-logout-success', false);
        });
    }
  });
</script>

<slot />
