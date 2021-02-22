<script>
  import { createEventDispatcher, onMount, setContext } from 'svelte';

  import firebase from 'firebase/app';
  import 'firebase/auth';
  import 'firebase/firestore';

  export let logout = false;

  const dispatch = createEventDispatcher();

  export const actions = {};

  onMount(async () => {
    const firebaseConfig = {
      apiKey: 'AIzaSyC75bagJGvDb5_2FJOT1yE2RV-97FGvYVs',
      authDomain: 'the-faithful.firebaseapp.com',
      projectId: 'the-faithful',
      storageBucket: 'the-faithful.appspot.com',
      messagingSenderId: '505590894387',
      appId: '1:505590894387:web:a97bd5deb4356a5ce569c3',
      databaseURL: 'https://the-faithful.firebaseio.com',
      //    measurementId: "G-3DLYVQYGW1",
    };

    if (firebase.apps.length === 0) {
      await firebase.initializeApp(firebaseConfig);
      await import('firebase/functions');
      if (window && window.location.href.indexOf('localhost') !== -1) {
        // dev mode
        firebase.functions().useEmulator('localhost', 15001);
      }

      dispatch('init', { firebase });
    }

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        console.log({ user }, 'aaa');
        if (user && !user.isAnonymous) {
          dispatch('auth-success', { user, firebase });
        } else {
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
    actions.clickMagicLinkSignin = async (email, onAuth = '/') => {
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
            `Email sent. Click on the link in your email to login.`,
            'success'
          );
        })
        .catch((error) => {
          window.pushToast(`Unable to send email. ${error.message}`, 'alert');
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

    actions.clickCoilSignin = async () => {
      console.log('coil signin');
      // const provider = new firebase.auth.FacebookAuthProvider();
      // await actions.doLogin(provider, "facebook");
    };

    // dispatch any params
    if (logout) {
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
