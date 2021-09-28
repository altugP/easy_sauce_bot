// ############################################################################
// Imports.
// ############################################################################
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const dotenv = require('dotenv')
const fs = require('fs')

// ############################################################################
// Initial Settings.
// ############################################################################
dotenv.config()
const clientId = process.env.DISCORD_CLIENT_ID
const guildId = process.env.DISCORD_GUILD_ID
const token = process.env.DISCORD_BOT_TOKEN

// ############################################################################
// Commands.
// ############################################################################
// This stores all commands that the client has put available.
const commands = []

// Reading all commands from their directory dynamically and storing them.
const _commandDirectoryAbs = 'bot/commands' //? Use this for `fs`.
const _commandDirectoryRel = './commands' //? Use this for `require`.
const _commandFileEnding = '.js'
const commandFiles = fs.readdirSync(_commandDirectoryAbs)
    .filter((f) => f.endsWith(_commandFileEnding))
for (const file of commandFiles) {
    const command = require(`${_commandDirectoryRel}/${file}`)
    commands.push(command.data.toJSON())
}

// ############################################################################
// Registering via REST requests.
// ############################################################################
const rest = new REST({ version: '9' }).setToken(token)

/**
 * Registers all commands in `./commands` on Discord so the user can see them
 * in their client.
 * 
 * Explanations:
 * - `Application Guild Commands`: Only available in the guild (server) they are
 * created in. This needs the `application.commands` scope on the Discord bot.
 * These should be used to test commands. Which guild these will be on is
 * declared in `.env` (see README.md).
 * - `(Global) Application Commands:`: Active on every guild (server) the bot is
 * on. These commands take up to 1 hour to register, which is why these should
 * only contain finished and tested commands.
 * 
 * @param {bool} global Should commands be globally enabled?. 
 * @returns {object} see above.
 */
async function registerSlashCommands(global) {
    try {
        console.log(`Started refreshing application (/) commands \
(${global ? 'global' : 'guild only'}).`)

        if (global) {
            await rest.put(
                Routes.applicationCommands(clientId, guildId),
                { body: commands }
            )
        } else {
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands }
            )
        }

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
}

registerSlashCommands(false)