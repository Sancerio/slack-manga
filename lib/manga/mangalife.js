const rp = require('request-promise');
const uri = 'http://mangalife.us';

const mangaLife = {
  source: 'Mangalife',
  isSpoiler: false,
  searchNewRelease,
};

function searchNewRelease() {
  return rp(uri)
    .then(html => {
      const mangaRegExp = new RegExp(`a href="(.*)" title="Read (.+) Chapter ([1-9]+) Online For Free"`, 'gi');

      let groups;
      const list = {};
      while ((groups = mangaRegExp.exec(html))) {
        list[groups[2].toUpperCase()] = { uri: `${uri}${groups[1]}`, chapter: groups[3] };
      }
      return list;
    });
}

module.exports = mangaLife;