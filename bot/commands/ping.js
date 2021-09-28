// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'ping',
    description: 'Standard ping command. Replies with pong.',
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description),
    async execute(interaction) {
        await interaction.reply('Pong!')
    },
}