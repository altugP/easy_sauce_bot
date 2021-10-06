// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const api = require('./../../api/search')

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

        // The final embed containing all information. Success and error
        // case alter this object.
        let embed = new MessageEmbed()
            .setAuthor(interaction.client.user.username,
                interaction.client.user.avatarURL())
            .setThumbnail(process.env.GOOGLE_IMAGE)
            .setTimestamp()

        // This row contains link buttons to the searches if successful.
        // If not successful this stays null.
        let row = null

        // Error.
        if (result.localPath === null) {
            embed.setColor(process.env.COLOR_ERROR)
                .setTitle('Google Search Error')
                .setDescription(result.imageTextClues)
                .addFields(
                    { name: 'Message', value: 'Could not find any useful image clues for this image.', },
                )
        }
        // Success.
        else {
            const linkButtons = []
            const searchEntryFields = []
            for (const i in result.entryData) {
                const entry = result.entryData[i]
                searchEntryFields.push({
                    name: `Additional Clue #${+i + 1}`,
                    value: `${entry.text}`,
                })
                linkButtons.push(
                    new MessageButton()
                        .setLabel(`Clue #${+i + 1}`)
                        .setStyle('LINK')
                        .setURL(`${entry.url}`)
                )
            }

            // Adjusting embed with new info.
            embed.setColor(process.env.COLOR_SUCCESS)
                .setTitle('Successful Search')
                .setDescription('Similar images found.')
                .addFields(
                    { name: 'Clues', value: result.imageTextClues, },
                    ...searchEntryFields,
                )

            // Adjusting button row.
            row = new MessageActionRow().addComponents(...linkButtons)
        }

        // Sending reply.
        await interaction.editReply({
            embeds: [embed],
            components: row === null ? [] : [row],
        })

        // Following up with screenshot if present.
        if (result.localPath !== null) {
            await interaction.followUp({
                content: `Sneak Peek of search for ${result.searchUrl}`,
                files: [result.localPath]
            })
        }

        // Following up test.
        if (result.matchingSitesData.length > 0) {
            const matchingSitesEmbeds = []
            const matchMaxIndex = result.matchingSitesData.length > 5
                ? 5
                : result.matchingSitesData.length
            for (let i = 0; i < matchMaxIndex; i++) {
                const match = result.matchingSitesData[i]
                matchingSitesEmbeds.push(
                    new MessageEmbed()
                        .setColor(process.env.COLOR_INFORMATION)
                        .setAuthor(interaction.client.user.username,
                            interaction.client.user.avatarURL())
                        .setDescription(`Google Hints: ${match.description}`)
                        .setURL(match.url)
                        .setThumbnail(url) //? This should never cause any issues, since the image has been found elsewhere already.
                        .setTitle(`Match: **${match.headline}**`)
                        .addFields({ name: 'Url', value: match.url, })
                        .setTimestamp()
                )
            }
            // Sending the embeds as a follow up message.
            await interaction.followUp({
                content: `Here are some sites that contain a similiar image to yours on a subsite.`,
                embeds: matchingSitesEmbeds,
            })
        }
    }
}