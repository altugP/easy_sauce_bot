// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const api = require('./../../api/search')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'tineye',
    description: 'Search for an image on TinEye. Works for most images.',
    url: {
        name: 'url',
        description: 'Direct URL to the image',
    },
    numRes: {
        name: 'amount',
        description: 'Max number of results to be returned. Default = 5. Must be < 11 and > 0 to be accepted.'
    }
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
                .setRequired(true))
        .addIntegerOption((numRes) =>
            numRes.setName(data.numRes.name)
                .setDescription(data.numRes.description)
                .setRequired(false)),
    async execute(interaction) {
        // Direct image url.
        const url = interaction.options.getString(data.url.name, true)
        let numRes = interaction.options.getInteger(data.numRes.name, false)
        if (numRes === null || numRes === undefined || numRes > 10 || numRes < 1) numRes = 5

        // Indicating user, that bot is searching.
        await interaction.deferReply()

        // Performing headless search.
        const result = await api.searchWithTinEye(url, true)

        // Error.
        if (result.status === -1) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR_ERROR)
                .setTitle('TinEye Error')
                .setAuthor(interaction.client.user.username,
                    interaction.client.user.avatarURL())
                .setDescription('An error occurred while searching for your image.')
                .setThumbnail(process.env.TINEYE_IMAGE)
                .addFields(
                    { name: 'Message', value: result.statusText },
                )
                .setTimestamp()
            return await interaction.editReply({ embeds: [embed] })
        }

        // No matches.
        if (result.status === 0) {
            const embed = new MessageEmbed()
                .setColor(process.env.COLOR_INFORMATION)
                .setTitle('No matches found')
                .setAuthor(interaction.client.user.username,
                    interaction.client.user.avatarURL())
                .setDescription('TinEye looked for similiar images but couldn\'t find any.')
                .setThumbnail(process.env.TINEYE_IMAGE)
                .addFields(
                    { name: 'Message', value: result.statusText },
                )
                .setTimestamp()
            return await interaction.editReply({ embeds: [embed] })
        }

        // Replying with data.
        if (result.status === 1) {
            const infoEmbed = new MessageEmbed()
                .setColor(process.env.COLOR_INFORMATION)
                .setTitle('Successful search')
                .setAuthor(interaction.client.user.username,
                    interaction.client.user.avatarURL())
                .setDescription(result.resultText.join(' '))
                .setThumbnail(process.env.TINEYE_IMAGE)
                .addFields(
                    { name: 'Message', value: result.statusText },
                    { name: 'Number of matches', value: result.amountOfMatches },
                    { name: 'Showing', value: `${numRes} matches` },
                )
                .setTimestamp()
            await interaction.editReply({ embeds: [infoEmbed] })
            const imageEmbeds = []
            for (const data of result.data) {
                //? Discord allows for a max of 10 embeds per message.
                if (imageEmbeds.length < numRes) {
                    const embed = new MessageEmbed()
                        .setColor(process.env.COLOR_SUCCESS)
                        .setTitle('Image Match')
                        .setAuthor(data.title)
                        .setDescription(data.crawlDate)
                        .setThumbnail(data.thumbnail)
                        .setURL(data.url)
                        .setTimestamp()
                    imageEmbeds.push(embed)
                }
            }
            return await interaction.followUp({ embeds: [...imageEmbeds] })
        }

        // This should never happen. But I'm not sure if it can happen.
        const embed = new MessageEmbed()
            .setColor(process.env.COLOR_ERROR)
            .setTitle('TinEye Error')
            .setAuthor(interaction.client.user.username,
                interaction.client.user.avatarURL())
            .setDescription('An error occurred while searching for your image.')
            .setThumbnail(process.env.TINEYE_IMAGE)
            .addFields(
                { name: 'Message', value: 'Something went horribly wrong.' },
            )
            .setTimestamp()
        await interaction.editReply({ embeds: [embed] })
    }
}