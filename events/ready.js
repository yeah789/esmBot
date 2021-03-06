const gm = require("gm");
const { promisify } = require("util");
const client = require("../utils/client.js");
const database = require("../utils/database.js");
const logger = require("../utils/logger.js");
const messages = require("../messages.json");
const misc = require("../utils/misc.js");
const helpGenerator = process.env.OUTPUT !== "" ? require("../utils/help.js") : null;
const twitter = process.env.TWITTER === "true" ? require("../utils/twitter.js") : null;

// run when ready
module.exports = async () => {
  // make sure settings/tags exist
  for (const [id] of client.guilds) {
    const guildDB = (await database.guilds.find({
      id: id
    }).exec())[0];
    if (!guildDB) {
      logger.log(`Registering guild database entry for guild ${id}...`);
      const newGuild = new database.guilds({
        id: id,
        tags: misc.tagDefaults,
        prefix: "&",
        warns: {}
      });
      await newGuild.save();
    } else if (guildDB && !guildDB.warns) {
      logger.log(`Creating warn object for guild ${id}...`);
      guildDB.set("warns", {});
      await guildDB.save();
    }
  }

  // generate docs
  if (helpGenerator) {
    await helpGenerator(process.env.OUTPUT);
  }

  // set activity (a.k.a. the gamer code)
  (async function activityChanger() {
    client.editStatus("dnd", {
      name: `${misc.random(messages)} | @esmBot help`
    });
    setTimeout(activityChanger, 900000);
  })();

  // add gm extensions
  gm.prototype.writePromise = promisify(gm.prototype.write);
  gm.prototype.streamPromise = promisify(gm.prototype.stream);
  gm.prototype.sizePromise = promisify(gm.prototype.size);
  gm.prototype.identifyPromise = promisify(gm.prototype.identify);
  //gm.prototype.bufferPromise = promisify(gm.prototype.toBuffer);
  gm.prototype.bufferPromise = function(format, type) {
    return new Promise((resolve, reject) => {
      if (format) {
        this.out(type !== "sonic" ? "-layers" : "", type !== "sonic" ? "optimize" : "").stream(format, (err, stdout, stderr) => {
          if (err) return reject(err);
          const chunks = [];
          stdout.on("data", (chunk) => {
            chunks.push(chunk);
          });
          // these are 'once' because they can and do fire multiple times for multiple errors,
          // but this is a promise so you'll have to deal with them one at a time
          stdout.once("end", () => {
            resolve(Buffer.concat(chunks));
          });
          stderr.once("data", (data) => {
            reject(data.toString());
          });
        });
      } else {
        this.out(type !== "sonic" ? "-layers" : "", type !== "sonic" ? "optimize" : "").stream((err, stdout, stderr) => {
          if (err) return reject(err);
          const chunks = [];
          stdout.on("data", (chunk) => {
            chunks.push(chunk);
          });
          // these are 'once' because they can and do fire multiple times for multiple errors,
          // but this is a promise so you'll have to deal with them one at a time
          stdout.once("end", () => {
            resolve(Buffer.concat(chunks));
          });
          stderr.once("data", (data) => {
            reject(data.toString());
          });
        });
      }
    });

  };

  // tweet stuff
  if (twitter !== null && twitter.active === false) {
    const blocks = await twitter.client.get("blocks/ids", {
      stringify_ids: true
    });
    const tweet = async () => {
      const tweets = (await database.tweets.find({
        enabled: true
      }).exec())[0];
      const tweetContent = await misc.getTweet(tweets);
      try {
        const info = await twitter.client.post("statuses/update", {
          status: tweetContent
        });
        logger.log(`Tweet with id ${info.data.id_str} has been tweeted with status code ${info.resp.statusCode} ${info.resp.statusMessage}`);
      } catch (e) {
        const error = JSON.stringify(e);
        if (error.includes("Status is a duplicate.")) {
          logger.log("Duplicate tweet, will retry in 30 minutes");
        } else {
          logger.error(e);
        }
      }
    };
    tweet();
    setInterval(tweet, 1800000);
    twitter.active = true;
    const stream = twitter.client.stream("statuses/filter", {
      track: `@${process.env.HANDLE}`
    });
    stream.on("tweet", async (tweet) => {
      if (tweet.user.screen_name !== "esmBot_" && !blocks.data.ids.includes(tweet.user.id_str)) {
        const tweets = (await database.tweets.find({
          enabled: true
        }).exec())[0];
        let tweetContent;
        if (tweet.text.includes("@this_vid") || tweet.text.includes("@DownloaderBot") || tweet.text.includes("@GetVideoBot") || tweet.text.includes("@DownloaderB0t") || tweet.text.includes("@thisvid_")) {
          tweetContent = await misc.getTweet(tweet, true, true);
        } else {
          tweetContent = await misc.getTweet(tweets, true);
        }
        const payload = {
          status: `@${tweet.user.screen_name} ${tweetContent}`,
          in_reply_to_status_id: tweet.id_str
        };
        const info = await twitter.client.post("statuses/update", payload);
        logger.log(`Reply with id ${info.data.id_str} has been tweeted with status code ${info.resp.statusCode} ${info.resp.statusMessage}`);
      }
    });
  }

  logger.log("info", `Successfully started ${client.user.username}#${client.user.discriminator} with ${client.users.size} users in ${client.guilds.size} servers.`);
};