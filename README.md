# Ikariam-Discord-Bot

This bot retrieves information from http://ika-search.com/ and makes the information accessible via commands, so you can easily lookup information about players without leaving Discord, and making it especially easy on mobile.

## Adding the bot to your server
https://github.com/7marre/Ikariam-Discord-Bot/wiki/Adding-the-bot-to-your-server

## Current Commands:
- !find (Player Name)
-- Shows a list of the specified players towns

- !growth (Player Name)
-- Shows the growth of a players total score over 30 days

- !growth (Player Name), (Score Category), (Duration In Days)
-- Shows the growth of a players score in the specified category over the specified amount of days

- !island (XX:YY)
-- Shows information about what towns and players are on the island along with their military score

- !info (Player Name)
-- Shows a players score and ranking in all score categories, also indicates if the player is inactive or in vacation mode

### Admin Commands (must be an Administrator):
- !globalserver (off / Ikariam Server Name)
-- Sets the Ikariam server to be used for all channels. If you turn this off you can use !addserver.

- !addserver (Ikariam Server Name)
-- Use this in each channel you want commands to work, this allows for different ikariam servers in different channels.
  
- !setnewschannel
-- Use this command in desired channel where you want the bot to automatically post Game News from Boards.

## Planned features:

- Set your own command prefix

- Configurable name of 'Admin' role

- Come with suggestions, everything is considered!
