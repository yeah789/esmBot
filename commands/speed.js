const {
  exec
} = require("child_process");
const util = require("util");
const gm = require("gm").subClass({
  imageMagick: true
});

exports.run = async (message) => {
  message.channel.sendTyping();
  const image = await require("../utils/imagedetect.js")(message);
  if (image === undefined) return `${message.author.mention}, you need to provide a GIF to speed up!`;
  if (image.type !== "gif") return `${message.author.mention}, that isn't a GIF!`;
  const value = await gm(image.path).identifyPromise();
  const delay = value.Delay ? value.Delay[0].split("x") : [0, 100];
  if (Math.round(parseInt(delay[0]) / 2) >= 2) {
    const buffer = await gm().delay(`${parseInt(delay[0]) / 2}x${delay[1]}`).out(image.path).bufferPromise(image.type);
    return message.channel.createMessage("", {
      file: buffer,
      name: "speed.gif"
    });
  } else {
    const numbers = (await util.promisify(exec)(`seq 0 2 ${value.Scene.length}`)).stdout.split("\n").join(",");
    const buffer = await gm().out("(").out(image.path).coalesce().out(")").out("-delete", numbers).bufferPromise(image.type);
    return message.channel.createMessage("", {
      file: buffer,
      name: "speed.gif"
    });
  }
};

exports.aliases = ["speedup", "fast", "gifspeed"];
exports.category = 5;
exports.help = "Makes a GIF faster";