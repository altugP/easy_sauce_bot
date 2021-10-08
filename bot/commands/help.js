// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const helpData = require('./../data/help_text.json')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'help',
    description: 'Gives you an overview of all commands supported by this bot.',
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description),
    async execute(interaction) {
        // Creating an embed with the commands' information.
        const fields = []
        Object.values(helpData).forEach((e) => {
            const desc = `${e.description}\n\n${e.tags.map((t) => `\`${t}\``).join(' ')}`
            fields.push({ name: e.command, value: desc, inline: true })
        })

        const embed = new MessageEmbed()
            .setColor(process.env.COLOR_INFORMATION)
            .setAuthor(interaction.client.user.username,
                interaction.client.user.avatarURL())
            .setDescription('Here are some useful commands. For more information on a specific command, use `help <commandName>`.')
            .setThumbnail(interaction.client.user.avatarURL())
            .setTitle('How to use this bot')
            .addFields(...fields)
            .setTimestamp()

        await interaction.reply({ embeds: [embed] })
    },
}