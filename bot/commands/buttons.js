// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'buttons',
    description: 'Play with random buttons.',
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description),
    async execute(interaction) {
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('primary')
                    .setLabel('Primary')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('secondary')
                    .setLabel('Secondary')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setURL('https://www.google.com')
                    .setLabel('Link')
                    .setStyle('LINK'),
            )
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Some title')
            .setURL('https://discord.js.org')
            .setDescription('Some description here')
        await interaction.reply({ content: 'Button Test', embeds: [embed], components: [row] })
    },
}