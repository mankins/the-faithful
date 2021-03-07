// bucket this ua into { bot, smart-tv, tablet, mobile, or desktop (default) }

const MobileDetect = require('mobile-detect');

exports.deviceType = (uaString) => {
  const agent = new MobileDetect(uaString);
  try {
    if (
      /(apple\s*tv|roku|CrKey|\bAFT.\s|XBOX|Nintendo|googletv|smart.{0,1}tv|playstation|hbbtv|philipstv|opera tv|inettv)/i.test(
        uaString
      )
    ) {
      return 'smart-tv';
    }
    if (
      /(bot|facebookexternalhit|spider|crawl|google|curl|slurp|wget|baidu|bing|duckduck|teoma|yandex|feedfetch|mediapartner|python|libwww|AppEngine-Goo|scoutjet|yahoo-ad)/i.test(
        uaString
      )
    ) {
      return 'bot';
    }
    if (agent.tablet()) {
      return 'tablet';
    }
    if (agent.mobile()) {
      return 'mobile';
    }
  } catch (e) {
    //    log.warn(`detect error ${e}`);
    // throw error?
  }
  return 'desktop';
};
