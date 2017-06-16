const rp = require('request-promise');

module.exports = function slackWebhook(slackWebhookUri) {
  /**
   * sendSlackWebhook - description
   *
   * @param  {type} text description
   * @return {type}      description
   */
  function sendSlackWebhook(text) {
    const options = {
      method: 'POST',
      uri: slackWebhookUri,
      body: { text },
      json: true,
    };

    return rp(options);
  }

  return {
    sendSlackWebhook,
  };
};
