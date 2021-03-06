const client = require("./client.js");
const logger = require("./logger.js");

module.exports = async (sound, message) => {
  if (message.member.voiceState.channelID) {
    if (!message.channel.guild.members.get(client.user.id).permission.has("voiceConnect") || !message.channel.permissionsOf(client.user.id).has("voiceConnect")) return client.createMessage(message.channel.id, `${message.author.mention}, I can't join this voice channel!`);
    const voiceChannel = message.channel.guild.channels.get(message.member.voiceState.channelID);
    if (!voiceChannel.permissionsOf(client.user.id).has("voiceConnect")) return client.createMessage(message.channel.id, `${message.author.mention}, I don't have permission to join this voice channel!`);
    const connection = await voiceChannel.join({
      opusOnly: true
    });
    if (connection.playing) return client.createMessage(message.channel.id, `${message.author.mention}, I'm already playing a sound!`);
    const playingMessage = await client.createMessage(message.channel.id, "🔊 Playing sound...");
    if (connection.playing) {
      connection.stopPlaying();
    }
    connection.play(sound);
    connection.on("error", (error) => {
      voiceChannel.leave();
      playingMessage.delete();
      logger.error(error);
    });
    connection.once("end", () => {
      voiceChannel.leave();
      playingMessage.delete();
    });
  } else {
    client.createMessage(message.channel.id, `${message.author.mention}, you need to be in a voice channel first!`);
  }
};
