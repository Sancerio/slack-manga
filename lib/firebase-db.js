const rp = require('request-promise');

module.exports = function (firebaseDbUri) {
  return {
    getData, saveData,
  };

  function getData() {
    const options = {
      uri: firebaseDbUri,
      json: true
    };

    return rp(options);
  }

  function saveData(data) {
    const options = {
      method: 'PUT',
      uri: firebaseDbUri,
      body: data,
      json: true
    };

    return rp(options);
  }
};
