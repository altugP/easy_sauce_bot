// ############################################################################
// Imports.
// ############################################################################
const { Client, Intents } = require('discord.js')
const dotenv = require('dotenv')

// ############################################################################
// Initial Settings.
// ############################################################################
dotenv.config()

// `client` is the actual bot instance.
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

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

    const { commandName } = interaction

    // Naive command handling.
    if (commandName === 'ping') {
        await interaction.reply('Pong!')
    } else if (commandName === 'server') {
        await interaction.reply(`Server name: ${interaction.guild.name}\
\nTotal members: ${interaction.guild.memberCount}`)
    } else if (commandName === 'user') {
        await interaction.reply(`Your tag: ${interaction.user.tag}\
\nYour id: ${interaction.user.id}`)
    }
})

// ############################################################################
// Bot activity.
// ############################################################################
// Logging in to Discord.
client.login(process.env.DISCORD_BOT_TOKEN)