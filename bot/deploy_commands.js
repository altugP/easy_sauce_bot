// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
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
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);