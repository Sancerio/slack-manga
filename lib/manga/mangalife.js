const rp = require('request-promise');

const uri = 'http://mangalife.us';
const mangaRegExp = new RegExp(
  'a href="(.*)" title="Read (.+) Chapter ([1-9]+) Online For Free"', 'gi');

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
          uri: `${uri}${matched[1]}`,
          chapter: matched[3],
        };
      }
      return newRelease;
    });
}

const mangaLife = {
  source: 'Mangalife',
  isSpoiler: false,
  searchNewRelease,
};
module.exports = mangaLife;
