const playSound = require("../utils/soundplayer.js");

exports.run = async (message) => {
  return playSound("./assets/audio/winxp.opus", message);
};

exports.aliases = ["windows", "xp"];
exports.category = 6;
exports.help = "Plays the Windows XP startup sound";