const _ = require('lodash');

const Promise = require('bluebird');
const rp = require('request-promise');

const slackWebhook = require('./lib/slack-webhook')(process.env.SLACK_WEBHOOK_URI);
const firebaseDb = require('./lib/firebase-db')(process.env.FIREBASE_DB_URI);

const mangalife = 'http://mangalife.us';

getAndPublish();

function getAndPublish() {
  Promise
    .all([rp(mangalife), firebaseDb.getData()])
    .then(([html, mangas]) => {
      _.keys(mangas).forEach((m) => {
        const mangaRegExp = new RegExp(`a href="(.*)" title="Read ${m} Chapter ([1-9]+) Online For Free"`, 'i');
        console.log(`Checking ${m}...`);
        const groups = mangaRegExp.exec(html);

        if (groups) {
          const mangaLink = `${mangalife}${groups[1]}`;
          const chapter = groups[2];
          const text = `<${mangaLink} | Read ${m} Chapter ${chapter}>`;

          if (!_.has(mangas[m], chapter)) {
            mangas[m][chapter] = 'Title';
            console.log(`New chapter detected: ${m} chapter ${chapter}`);
            Promise
              .all([slackWebhook.sendSlackWebhook(text), firebaseDb.saveData(mangas)])
              .then(() => console.log('Successfully publish message to slack'))
              .catch((err) => console.log(err));
          }
        }
    })
  }).catch((err) => {
      console.log(err);
  });
}

module.exports = { getAndPublish };
