// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'server',
    description: 'Basic command. Replies with info on this server.',
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description),
    async execute(interaction) {
        await interaction.reply(`Server name: ${interaction.guild.name}\
\nTotal members: ${interaction.guild.memberCount}`)
    },
}