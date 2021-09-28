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
// Run on start.
client.once('ready', () => {
    console.log('Bot started.')
})

// Run every time someone interacts with the bot or in the bot's presence.
client.on('interactionCreate', async (interaction) => {
    // If the interaction is not a command it can be ignored for now.
    if (!interaction.isCommand()) return

    // Fetching the command from the client's `commands` Collection.
    const command = client.commands.get(interaction.commandName)

    // If the command doesn't exist, something went wrong.
    //? Could have been a deleted command.
    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({
            content: 'An error occurred while executing this command.',
            ephemeral: true, //? Only visible to the user that called this.
        })
    }
})

// ############################################################################
// Bot activity.
// ############################################################################
// Logging in to Discord.
client.login(process.env.DISCORD_BOT_TOKEN)