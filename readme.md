# <img src="https://github.com/TheEssem/esmBot/raw/master/esmbot.png" width="128"> esmBot
[![esmBot Support](https://discordapp.com/api/guilds/592399417676529688/embed.png)](https://discord.gg/vfFM7YT) ![GitHub license](https://img.shields.io/github/license/TheEssem/esmBot.svg)


esmBot is an entertainment-focused Discord bot made using [Eris](https://abal.moe/Eris/) with soundboard, utility, and image manipulation commands.

[![Top.gg](https://top.gg/api/widget/429305856241172480.svg)](https://top.gg/bot/429305856241172480)

## Usage
You can invite the bot to your server using this link: https://projectlounge.pw/invite

A command list can be found [here](https://projectlounge.pw/esmBot/help.html).

If you want to run it locally for testing purposes, you should install ImageMagick (version >=7), FFmpeg, and MongoDB:

```shell
# In many cases you will need to build ImageMagick from source instead of installing from apt/similar package managers.
# Instructions to do so can be found here: https://imagemagick.org/script/install-source.php
sudo apt-get install imagemagick ffmpeg mongodb
```

After that, you should install the rest of the dependencies using npm:

```shell
npm install
```

Finally, fill in the info inside `.env.example`, rename it to `.env`, and run `app.js`.

If you want to run this on Windows, I highly recommend using Windows Subsystem for Linux. I personally used the [Ubuntu](https://www.microsoft.com/store/productId/9NBLGGH4MSV6) distro for testing, however other distros might work as well.

## Credits
Icon by [Stellio](https://twitter.com/SteelStellio).
All images, sounds, and fonts are copyright of their respective owners.
