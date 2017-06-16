const rp = require('request-promise');

module.exports = function firebaseDb(firebaseDbUri) {
  /**
   * getData - description
   *
   * @return {type}  description
   */
  function getData() {
    const options = {
      uri: firebaseDbUri,
      json: true,
    };

    return rp(options);
  }

  /**
   * saveData - description
   *
   * @param  {type} data description
   * @return {type}      description
   */
  function saveData(data) {
    const options = {
      method: 'PUT',
      uri: firebaseDbUri,
      body: data,
      json: true,
    };

    return rp(options);
  }

  return {
    getData,
    saveData,
  };
};
