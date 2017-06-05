const _ = require('lodash');
const Promise = require('bluebird');

const type = process.env.SOURCE;
const slackWebhook = require('./lib/slack-webhook')(process.env.SLACK_WEBHOOK_URI);
const firebaseDb = require('./lib/firebase-db')(process.env.FIREBASE_DB_URI);

let source;
switch (type) {
  case 'BAKA_DATA':
    source = require('./lib/manga/bakadata');
    break;
  case 'MANGA_LIFE':
    source = require('./lib/manga/mangalife');
    break;
  case 'MANGA_STREAM':
    source = require('./lib/manga/mangastream');
    break;
}

getAndPublish();

function getAndPublish() {
  Promise
    .all([source.searchNewRelease(), firebaseDb.getData()])
    .then(([list, mangas]) => {
      let shouldUpdate = false;
      _.keys(mangas).forEach((m) => {
        console.log(`Checking ${m}...`);
        const newRelease = list[m.toUpperCase()];

        if (newRelease) {
          const mangaLink = newRelease.uri;
          const chapter = newRelease.chapter;
          const text = `<${mangaLink} | ${source.source} ${source.isSpoiler ? '(Spoiler)' : ''}: Read ${m} Chapter ${chapter}>`;

          if (!_.has(mangas[m], chapter)) {
            console.log(`New chapter detected: ${m} chapter ${chapter}`);
            shouldUpdate = true;
            mangas[m][chapter] = newRelease.title || '-';
            slackWebhook
              .sendSlackWebhook(text)
              .then(() => console.log('Successfully publish message to slack'))
              .catch((err) => console.log(err));
          }
        }
      });

      if (shouldUpdate) {
        console.log('Updating DB...');
        firebaseDb.saveData(mangas);
      }
    }).catch((err) => {
    console.log(err);
  });
}

module.exports = { getAndPublish };
