// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')

// ############################################################################
// Command data and logic.
// ############################################################################
const data = {
    name: 'add',
    description: 'Adds two (2) numbers a & b and returns the result.',
    a: 'a',
    aDescription: 'The first number in the equation.',
    aRequired: true,
    b: 'b',
    bDescription: 'The second number in the equation.',
    bRequired: true,
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)
        .addNumberOption(option =>
            option.setName(data.a)
                .setDescription(data.aDescription)
                .setRequired(data.aRequired))
        .addNumberOption(option =>
            option.setName(data.b)
                .setDescription(data.bDescription)
                .setRequired(data.bRequired)),
    async execute(interaction) {
        const a = interaction.options.getNumber(data.a, data.aRequired)
        const b = interaction.options.getNumber(data.b, data.bRequired)
        await interaction.reply(`Your equation:\n**${a} + ${b} = ${a + b}**.`)
    },
}