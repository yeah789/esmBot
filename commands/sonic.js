const gm = require("gm").subClass({
  imageMagick: true
});
const wrap = require("../utils/wrap.js");

exports.run = async (message, args) => {
  if (args.length === 0) return `${message.author.mention}, you need to provide some text to make a Sonic meme!`;
  message.channel.sendTyping();
  const template = "./assets/images/sonic.jpg";
  const file = `/tmp/${Math.random().toString(36).substring(2, 15)}.png`;
  const cleanedMessage = args.join(" ").replace(/&/g, "\\&amp;").replace(/>/g, "\\&gt;").replace(/</g, "\\&lt;").replace(/"/g, "\\&quot;").replace(/'/g, "\\&apos;");
  await gm(474, 332).out("+size").background("none").gravity("Center").out("-pointsize", 72).out("-font", "Bitstream Vera Sans").out(`pango:<span foreground="white">${wrap(cleanedMessage, {width: 15, indent: ""})}</span>`).writePromise(file);
  const buffer = await gm(template).composite(file).gravity("Center").geometry("474x332+160+10").bufferPromise("png", "sonic");
  return message.channel.createMessage("", {
    file: buffer,
    name: "sonic.png"
  });
};

exports.category = 4;
exports.help = "Creates a Sonic speech bubble image";
exports.params = "[text]";