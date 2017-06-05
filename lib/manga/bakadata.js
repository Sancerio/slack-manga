const rp = require('request-promise');
const uri = 'http://bakadata.com';

const bakaData = {
  source: 'Bakadata',
  isSpoiler: true,
  searchNewRelease,
};

function searchNewRelease() {
  return rp(uri)
    .then(html => {
      const mangaRegExp = new RegExp(`a href='(.*)' title='(.+) ([1-9]+) Spoiler'`, 'gi');

      let groups;
      const list = {};
      while ((groups = mangaRegExp.exec(html))) {
        list[groups[2].toUpperCase()] = { uri: groups[1], chapter: groups[3] };
      }
      return list;
    });
}

module.exports = bakaData;