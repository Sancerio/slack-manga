const bakadata = require('./bakadata');
const mangalife = require('./mangalife');
const mangastream = require('./mangastream');

/**
 * getSource - description
 *
 * @param  {type} type description
 * @return {type}      description
 */
function getSource(type) {
  switch (type) {
    case 'BAKA_DATA':
      return bakadata;
    case 'MANGA_LIFE':
      return mangalife;
    case 'MANGA_STREAM':
    default:
      return mangastream;
  }
}

module.exports = { getSource };
