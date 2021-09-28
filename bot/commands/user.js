// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'user',
    description: 'Basic command. Replies with information on you.',
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description),
    async execute(interaction) {
        await interaction.reply(`Your tag: ${interaction.user.tag}\
\nYour id: ${interaction.user.id}`)
    },
}