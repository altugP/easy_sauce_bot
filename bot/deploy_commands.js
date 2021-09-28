// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const dotenv = require('dotenv')

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
const commands = [
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    new SlashCommandBuilder()
        .setName('server')
        .setDescription('Replies with server info!'),
    new SlashCommandBuilder()
        .setName('user')
        .setDescription('Replies with user info!'),
]
    .map(command => command.toJSON());

// ############################################################################
// Registering via REST requests.
// ############################################################################
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);