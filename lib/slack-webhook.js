const rp = require('request-promise');

module.exports = function (slackWebhookUri) {
  return {
    sendSlackWebhook,
  };

  function sendSlackWebhook(text) {
    const options = {
      method: 'POST',
      uri: slackWebhookUri,
      body: { text },
      json: true
    };

    return rp(options);
  }
};
