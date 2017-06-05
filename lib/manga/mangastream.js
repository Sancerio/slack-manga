const rp = require('request-promise');
const cheerio = require('cheerio');
const uri = 'https://mangastream.com';

const mangaStream = {
  source: 'Mangastream',
  isSpoiler: false,
  searchNewRelease,
};

function searchNewRelease() {
  return rp(uri)
    .then(html => {
      const $ = cheerio.load(html);
      const list = {};

      $('ul.new-list > li.active > a')
        .each((i, el) => {
          const contents = $(el).contents();
          list[contents.filter((i2, el2) => el2.nodeType === 3).first().text().trim().toUpperCase()] = {
            uri: $(el).attr('href'),
            chapter: parseInt(contents.filter((i2, el2) => el2.tagName === 'strong').first().text().trim()),
            title: contents.filter((i2, el2) => el2.tagName === 'em').first().text().trim(),
          };
        });

      return list;
    });
}

module.exports = mangaStream;