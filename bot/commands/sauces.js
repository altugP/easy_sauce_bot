// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const sauceData = require('../data/sauce_data.json')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'sauces',
    description: 'Gives recipes and instructions for some basic sauces.',
    choice: {
        name: 'sauce-choice',
        description: 'Select your desired sauce.',
    },
    sauces: sauceData,
}

function _getSauceFromIndex(index) {
    if (index >= data.sauces.length || index < 0) return null
    return data.sauces[index]
}

function _getIndexToSauce(name) {
    for (let i = 0; i < data.sauces.length; i++) {
        if (data.sauces[i].name === name) return i
    }
    return null
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)
        .addIntegerOption((option) => {
            let opt = option.setName(data.choice.name)
                .setDescription(data.choice.description)
                .setRequired(true)
            for (let i = 0; i < data.sauces.length; i++) {
                opt = opt.addChoice(data.sauces[i].name, i)
            }
            return opt
        }
        ),
    async execute(interaction) {
        // Gathering user input.
        const userChoice = interaction.options.getInteger(data.choice.name, true)
        const sauce = _getSauceFromIndex(userChoice)

        // Creating embed.
        const listingSymbol = '- '
        const ingredientsString = `${listingSymbol}${sauce.ingredients.join(`\n${listingSymbol}`)}`

        let methodString = ''
        for (const i in sauce.instructions) {
            methodString += `**${+i + 1}.** ${sauce.instructions[i]}\n\n`
        }

        const infoEmbed = new MessageEmbed()
            .setColor(process.env.COLOR_INFORMATION)
            .setTitle(sauce.name)
            .setURL(sauce.url)
            .setAuthor(sauce.author)
            .setDescription(sauce.description)
            .addFields(
                { name: 'Servings', value: `serves ${sauce.info.servings}`, inline: true },
                { name: 'Prep Time', value: `🕒 ${sauce.info.prepTime}`, inline: true },
                { name: 'Cooking Time', value: `🕒 ${sauce.info.cookTime}`, inline: true },
                { name: 'Ingredients', value: ingredientsString },
                { name: 'Method', value: methodString },
            )
            .setThumbnail(sauce.thumbnail)
            .setTimestamp()

        // Sending reply.
        await interaction.reply({ embeds: [infoEmbed] })
    },
}