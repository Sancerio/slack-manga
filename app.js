const work = require('./work');

setInterval(work.getAndPublish, 15 * 60 * 1000);
