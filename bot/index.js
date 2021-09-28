// ############################################################################
// Imports.
// ############################################################################
const { Client, Collection, Intents } = require('discord.js')
const dotenv = require('dotenv')
const fs = require('fs')

// ############################################################################
// Initial Settings.
// ############################################################################
dotenv.config()

// ############################################################################
// Command Handling.
// ############################################################################
// `client` is the actual bot instance.
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })
// This stores all commands that the client has put available.
client.commands = new Collection() //? Fancy Discord.js list.

// Reading all commands from their directory and binding them to the bot.
const _commandDirectoryAbs = 'bot/commands' //? Use this for `fs`.
const _commandDirectoryRel = './commands' //? Use this for `require`.
const _commandFileEnding = '.js'
const commandFiles = fs.readdirSync(_commandDirectoryAbs)
    .filter((f) => f.endsWith(_commandFileEnding))
for (const file of commandFiles) {
    const command = require(`${_commandDirectoryRel}/${file}`)
    client.commands.set(command.data.name, command)
}

// ############################################################################
// Event Handling.
// ############################################################################
// Reading all event files from their repository and binding them to the bot.
const _eventDirectoryAbs = 'bot/events' //? Use this for `fs`.
const _eventDirectoryRel = './events' //? Use this for `require`.
const _eventFileEnding = '.js'
const eventFiles = fs.readdirSync(_eventDirectoryAbs)
    .filter((f) => f.endsWith(_eventFileEnding))
for (const file of eventFiles) {
    const event = require(`${_eventDirectoryRel}/${file}`)
    // Run only once.
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    }
    // Run every time the specific event occurrs.
    else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

// ############################################################################
// Bot activity.
// ############################################################################
// Logging in to Discord.
client.login(process.env.DISCORD_BOT_TOKEN)