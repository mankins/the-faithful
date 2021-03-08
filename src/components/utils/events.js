import { cumulativeArgumentDebounce } from './debounce';

const bufferPeriod = 10;

const sendEvent = cumulativeArgumentDebounce((argList) => {
  const messages = argList.map((args) => args[0]);

  const payload = JSON.stringify(messages) || '';
  let inUrl =
    'https://us-central1-the-faithful.cloudfunctions.net/eventsIn?_api=anAy';

  if (window && window.location.href.indexOf('localhost') !== -1) {
    // dev mode
    inUrl =
      'http://localhost:15001/the-faithful/us-central1/eventsIn?_api=anAy';
  }

  let beaconSent = false;

  if (
    navigator &&
    typeof navigator.sendBeacon === 'function' &&
    typeof window.Blob === 'function'
  ) {
    // Creates a POST request containing a stringified JSON body with mime-type of `text/plain`
    beaconSent = navigator.sendBeacon(inUrl, payload);
  }

  if (!beaconSent) {
    if (payload.length < 1500) {
      const src = `${inUrl}&data=${encodeURIComponent(payload)}`;
      const beacon = new Image();
      beacon.src = src;
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', inUrl, true);
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(payload);
    }
  }
}, bufferPeriod);

export { sendEvent };
