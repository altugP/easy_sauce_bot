// ############################################################################
// Imports.
// ############################################################################
const { SlashCommandBuilder } = require('@discordjs/builders')

// ############################################################################
// Command data and logic.
// ############################################################################
const RPS = {
    r: 0,
    p: 1,
    s: 2,
    matrix: [
        // R P S
        [0, -1, 1], // R
        [1, 0, -1], // P
        [-1, 1, 0], // S
    ],
    eval(a, b) {
        return RPS.matrix[a][b]
    },
    getEmoji(choice) {
        if (choice === RPS.r) return '🗿'
        if (choice === RPS.p) return '📝'
        if (choice === RPS.s) return '✂️'
        return '❌' // Error.
    }
}
const data = {
    name: 'rps',
    description: 'Play rock paper scissors against me.',
    choiceName: 'choice',
    choiceDescription: 'Rock, Paper, or Scissors?',
    choiceRequired: true,
    rName: 'Rock',
    pName: 'Paper',
    sName: 'Scissors',
    userWin: 'Congratulations! You\'ve won.',
    cpuWin: 'You lost, as expected!',
    tie: 'We\'ve tied. Want a rematch?',
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    data: new SlashCommandBuilder()
        .setName(data.name)
        .setDescription(data.description)
        .addIntegerOption(option =>
            option.setName(data.choiceName)
                .setDescription(data.choiceDescription)
                .setRequired(data.choiceRequired)
                .addChoice(data.rName, RPS.r)
                .addChoice(data.pName, RPS.p)
                .addChoice(data.sName, RPS.s)),
    async execute(interaction) {
        const userChoice = interaction.options.getInteger(data.choiceName, data.choiceRequired)
        const userEmoji = RPS.getEmoji(userChoice)
        const cpuChoice = Math.floor(Math.random() * 3) // ? Random integer in [0, 2].
        const cpuEmoji = RPS.getEmoji(cpuChoice)
        const evaluation = RPS.eval(userChoice, cpuChoice)

        await interaction.reply(`Your choice: ${userEmoji}.\nMy choice: ${cpuEmoji}
**${evaluation === 0 ? data.tie : (evaluation === 1 ? data.userWin : data.cpuWin)}**`)
    },
}