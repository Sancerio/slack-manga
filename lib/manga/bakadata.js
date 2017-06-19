const rp = require('request-promise');

const uri = 'http://bakadata.com';
const mangaRegExp = new RegExp(
  'a href=\'(.*)\' title=\'(.+) ([0-9]+) Spoiler\'', 'gi');

/**
 * searchNewRelease - description
 *
 * @return {type}  description
 */
function searchNewRelease() {
  return rp(uri)
    .then((html) => {
      const newRelease = {};
      for (
        let matched = mangaRegExp.exec(html);
        matched;
        matched = mangaRegExp.exec(html)
      ) {
        newRelease[matched[2].toUpperCase()] = {
          uri: matched[1],
          chapter: matched[3],
        };
      }
      return newRelease;
    });
}

const bakaData = {
  source: 'Bakadata',
  isSpoiler: true,
  searchNewRelease,
};

module.exports = bakaData;
