const rp = require('request-promise');
const cheerio = require('cheerio');

const uri = 'https://mangastream.com';

/**
 * searchNewRelease - description
 *
 * @return {type}  description
 */
function searchNewRelease() {
  return rp(uri)
    .then((html) => {
      const $ = cheerio.load(html);
      const newRelease = {};

      $('ul.new-list > li.active > a')
        .each((i, el) => {
          const contents = $(el).contents();
          newRelease[
            contents
              .filter((i2, el2) => el2.nodeType === 3)
              .first()
              .text()
              .trim()
              .toUpperCase()
          ] = {
            uri: $(el).attr('href'),
            chapter: parseInt(
              contents
                .filter((i2, el2) => el2.tagName === 'strong')
                .first()
                .text()
                .trim(), 10),
            title: contents
              .filter((i2, el2) => el2.tagName === 'em')
              .first()
              .text()
              .trim(),
          };
        });

      return newRelease;
    });
}

const mangaStream = {
  source: 'Mangastream',
  isSpoiler: false,
  searchNewRelease,
};

module.exports = mangaStream;
