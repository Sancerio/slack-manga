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

fetchAndPublish();

function fetchAndPublish() {
  Promise
    .all([source.searchNewRelease(), firebaseDb.getData()])
    .then(([list, mangas]) => {
        let shouldUpdate = false;
        _.keys(mangas).forEach((m) => {
          console.log(`Checking ${m}...`);
          const newRelease = list[m.toUpperCase()];

          if (newRelease && !_.has(mangas[m], newRelease.chapter)) {
            shouldUpdate = true;
            mangas[m][newRelease.chapter] = newRelease.title || '-';
            publishWebhook(newRelease, m);
          }
        });

        if (shouldUpdate) {
          console.log('Updating DB...');
          firebaseDb.saveData(mangas);
        }
      }
    ).catch((err) => {
    console.log(err);
  });
}

function publishWebhook(newRelease, manga) {
  const chapter = newRelease.chapter;
  const mangaLink = newRelease.uri;
  const text = `<${mangaLink} | ${source.source} ${source.isSpoiler ? '(Spoiler)' : ''}: Read ${manga} Chapter ${chapter}>`;

  slackWebhook
    .sendSlackWebhook(text)
    .then(() => console.log('Successfully publish message to slack'))
    .catch((err) => console.log(err));

  console.log(`New chapter detected: ${manga} chapter ${chapter}`);
}

module.exports = {fetchAndPublish};
