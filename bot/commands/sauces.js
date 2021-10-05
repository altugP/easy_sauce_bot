// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')

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
    sauces: [
        {
            name: 'Béchamel Sauce',
        },
        {
            name: 'Hollandaise Sauce',
        },
        {
            name: 'Pesto alla Genovese',
        },
        {
            name: 'Marinara Sauce',
        },
        {
            name: 'Ajvar',
        },
        {
            name: 'Teriyaki Sauce',
        },
    ]
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
        const userChoice = interaction.options.getInteger(data.choice.name, true)
        const sauce = _getSauceFromIndex(userChoice)
        await interaction.reply(`Choice: ${userChoice} => ${sauce.name}`)
    },
}