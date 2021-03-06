const client = require("../utils/client.js");

exports.run = async (message) => {
  if (message.member.voiceState.channelID) {
    if (!message.channel.guild.members.get(client.user.id).permission.has("voiceConnect") || !message.channel.permissionsOf(client.user.id).has("voiceConnect")) return `${message.author.mention}, I can't join this voice channel!`;
    if (message.author.id !== "198198681982205953") return `${message.author.mention}, this command is for testing and is restricted to owners.`;
    const voiceChannel = message.channel.guild.channels.get(message.member.voiceState.channelID);
    client.createMessage(message.channel.id, "🔊 Playing...");
    const connection = await voiceChannel.join();
    connection.play(message.attachments[0].url, {
      inlineVolume: true
    });
    connection.setVolume(0.5);
    connection.on("error", (error) => {
      voiceChannel.leave();
      throw error;
    });
    connection.on("end", () => {
      voiceChannel.leave();
      return "This music session has now ended.";
    });
  } else {
    return `${message.author.mention}, you need to be in a voice channel first!`;
  }
};

exports.category = 7;
exports.help = "Plays an audio file";