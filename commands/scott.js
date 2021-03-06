const gm = require("gm").subClass({
  imageMagick: true
});

exports.run = async (message) => {
  message.channel.sendTyping();
  const image = await require("../utils/imagedetect.js")(message);
  if (image === undefined) return `${message.author.mention}, you need to provide an image to make a Scott the Woz TV meme!`;
  const template = "./assets/images/scott.png";
  const buffer = await gm(template).out("null:").out("(").out(image.path).coalesce().out("-virtual-pixel", "transparent").resize("415x234!").out("+distort", "Perspective", "0,0 129,187 415,0 517,182 415,234 517,465 0,234 132,418").out(")").compose("over").gravity("Center").geometry("-238-98").out("-layers", "composite").bufferPromise(image.type);
  return message.channel.createMessage("", {
    file: buffer,
    name: `scott.${image.type}`
  });
};

exports.aliases = ["woz", "tv", "porn"];
exports.category = 5;
exports.help = "Creates a Scott the Woz TV image";