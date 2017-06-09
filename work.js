const type = process.env.SOURCE;
const firebaseDbUri = process.env.FIREBASE_DB_URI;
const slackWebhookUri = process.env.SLACK_WEBHOOK_URI;

const _ = require('lodash');
const Promise = require('bluebird');
const mangaSource = require('./lib/manga/source');
const firebaseDb = require('./lib/firebase-db')(firebaseDbUri);
const slackWebhook = require('./lib/slack-webhook')(slackWebhookUri);

/**
 * publishWebhook - description
 *
 * @param  {type} newRelease description
 * @param  {type} manga      description
 * @param  {type} source     description
 * @return {type}            description
 */
function publishWebhook(newRelease, manga, source) {
  const chapter = newRelease.chapter;
  const mangaLink = newRelease.uri;
  const text = `<${mangaLink} | ${source.source} \
    ${source.isSpoiler ? '(Spoiler)' : ''} : \
    Read ${manga} Chapter ${chapter}>`;

  slackWebhook
    .sendSlackWebhook(text)
    .then(() => console.log('Successfully publish message to slack'))
    .catch(err => console.log(err));

  console.log(`New chapter detected: ${manga} chapter ${chapter}`);
}

/**
 * checkNewMangas - description
 *
 * @param  {type} source        description
 * @param  {type} newMangas     description
 * @param  {type} currentMangas description
 * @return {type}               description
 */
function checkNewMangas(source, newMangas, currentMangas) {
  let shouldUpdate = false;
  const mangas = _.cloneDeep(currentMangas);

  _.keys(currentMangas).forEach((m) => {
    console.log(`Checking ${m}...`);
    const newRelease = newMangas[m.toUpperCase()];

    if (newRelease && !_.has(mangas[m], newRelease.chapter)) {
      shouldUpdate = true;
      mangas[m][newRelease.chapter] = newRelease.title || '-';
      publishWebhook(newRelease, m, source);
    }
  });

  return { shouldUpdate, mangas };
}

/**
 * shouldUpdateMangas - description
 *
 * @param  {type} shouldUpdate description
 * @param  {type} mangas       description
 * @return {type}              description
 */
function shouldUpdateMangas(shouldUpdate, mangas) {
  if (shouldUpdate) {
    console.log('Updating DB...');
    firebaseDb.saveData(mangas);
  }
}
/**
 * fetchAndPublish - description
 *
 * @param  {type} source description
 * @return {type}        description
 */
function fetchAndPublish(source) {
  Promise
    .all([source.searchNewRelease(), firebaseDb.getData()])
    .then(([newMangas, current]) => checkNewMangas(source, newMangas, current))
    .then(({ shouldUpdate, mangas }) => {
      shouldUpdateMangas(shouldUpdate, mangas);
    })
    .catch(err => console.log(err));
}

fetchAndPublish(mangaSource.getSource(type));

module.exports = { fetchAndPublish };
