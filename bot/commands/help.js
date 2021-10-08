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
    embed: {
        title: 'How to use this bot',
        description: 'Here are some useful commands. For more information on a specific command, use `/help <command-name>`.',
    },
    errorEmbed: {
        title: 'Unsupported command',
        description: 'The command you tried to get more information on does not exist. Please take a look at all supported commands. Maybe you made a typo?',
    },
    option: {
        name: 'command-name',
        description: 'Name of the command you want to learn more about.',
    }
}

function _buildOverviewEmbed(interaction) {
    // Creating an embed with the commands' information.
    const fields = []
    Object.values(helpData).forEach((e) => {
        //? Combining tags and description and also giving each tag a `` to make it stand out.
        const desc = `${e.description}\n\n${e.tags.map((t) => `\`${t}\``).join(' ')}`
        fields.push({ name: e.command, value: desc, inline: true })
    })
    const embed = new MessageEmbed()
        .setColor(process.env.COLOR_INFORMATION)
        .setAuthor(interaction.client.user.username,
            interaction.client.user.avatarURL())
        .setDescription(data.embed.description)
        .setThumbnail(interaction.client.user.avatarURL())
        .setTitle(data.embed.title)
        .addFields(...fields)
        .setTimestamp()
    return embed
}

function _buildErrorEmbed(interaction, commandNames) {
    const embed = new MessageEmbed()
        .setColor(process.env.COLOR_ERROR)
        .setAuthor(interaction.client.user.username,
            interaction.client.user.avatarURL())
        .setDescription(data.errorEmbed.description)
        .setThumbnail(interaction.client.user.avatarURL())
        .setTitle(data.errorEmbed.title)
        .addFields({ name: 'Supported Commands', value: `${commandNames.map((c) => `\`${c}\``).join(' ')}` })
        .setTimestamp()
    return embed
}

function _buildInfoEmbed(interaction, input) {
    const info = helpData[input].info
    const embed = new MessageEmbed()
        .setColor(process.env.COLOR_INFORMATION)
        .setAuthor(interaction.client.user.username,
            interaction.client.user.avatarURL())
        .setTitle(info.title)
        .setDescription(info.description)
        .setThumbnail(interaction.client.user.avatarURL())
        .addFields(
            { name: 'Usage', value: info.usage, },
            { name: 'Input', value: info.input, },
            { name: 'Output', value: info.output, },
        )
        .setTimestamp()
    return embed
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)
        .addStringOption(option =>
            option.setName(data.option.name)
                .setDescription(data.option.description)
                .setRequired(false)),
    async execute(interaction) {
        // Gathering all supported and active commands.
        const commandNames = [...interaction.client.commands.keys()]

        // Getting user input.
        const input = await interaction.options.getString(data.option.name, false)

        // Creating the correct embed depending on user's input.
        let embed = null
        if (input === null) {
            //? User wants to display basic overview.
            embed = _buildOverviewEmbed(interaction)
        } else {
            //? User wants to get information on a specific command.
            if (!commandNames.includes(input)) {
                embed = _buildErrorEmbed(interaction, commandNames)
            } else {
                embed = _buildInfoEmbed(interaction, input)
            }
        }

        // Replying.
        await interaction.reply({ embeds: [embed] })
    },
}