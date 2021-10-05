// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const api = require('./../../api/search')
const { execute } = require('./tineye')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'google',
    description: 'Search for an image on Google Images. Works for most images.',
    url: {
        name: 'url',
        description: 'Direct URL to the image',
    },
}

// ############################################################################
// Exports.
// ############################################################################
//*[@id="islrg"]/div[1]/div[1]
//*[@id="islrg"]/div[1]/div[2]

module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)
        .addStringOption((url) =>
            url.setName(data.url.name)
                .setDescription(data.url.description)
                .setRequired(true)),
    async execute(interaction) {
        // Direct image url.
        const url = interaction.options.getString(data.url.name, true)

        // Indicating user, that bot is searching.
        await interaction.deferReply()

        // Searching on google.
        const result = await api.searchWithGoogle(url, true)

        let embed = new MessageEmbed()
            .setTitle('Google Search Error')
            .setAuthor(interaction.client.user.username,
                interaction.client.user.avatarURL())
            .setThumbnail(process.env.GOOGLE_IMAGE)
            .setTimestamp()

        // Error.
        if (result.localPath === null) {
            embed.setColor(process.env.COLOR_ERROR)
                .setDescription(result.imageTextClues)
                .addFields(
                    { name: 'Message', value: 'Could not find any useful image clues for this image.', },
                )
        }
        // Success.
        else {
            embed.setColor(process.env.COLOR_SUCCESS)
                .setDescription('Similar images found.')
                .addFields(
                    { name: 'Clues', value: result.imageTextClues, },
                )
        }

        // Sending reply.
        await interaction.editReply({
            embeds: [embed],
        })

        await interaction.followUp({
            files: [result.localPath]
        })
    }
}