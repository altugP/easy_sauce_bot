// ############################################################################
// Event data and logic.
// ############################################################################
const data = {
    name: 'interactionCreate',
    once: false,
}

async function handleCommand(interaction) {
    // Fetching the command from the client's `commands` Collection.
    const command = interaction.client.commands.get(interaction.commandName)

    // If the command doesn't exist, something went wrong.
    //? Could have been a deleted command.
    if (!command) return

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)

        try {
            //? This should only be called if the interaction hasn't been replied
            //? to yet.
            await interaction.reply({
                content: 'An error occurred while executing this command.',
                ephemeral: true, //? Only visible to the user that called this.
            })
        } catch (error) {
            //? This is called if the interaction has already been replied to.
            await interaction.followUp({
                content: 'An error occurred while executing this command.',
                ephemeral: true, //? Only visible to the user that called this.
            })
        }
    }
}

async function handleButton(interaction) {
    await interaction.deferReply()
    if (interaction.customId === 'primary') {
        await interaction.editReply('Primary')
    } else if (interaction.customId === 'secondary') {
        await interaction.editReply('Secondary')
    } else {
        await interaction.editReply('Oi.')
    }
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    name: data.name,
    once: data.once,
    async execute(interaction) {
        if (interaction.isCommand()) {
            return handleCommand(interaction)
        } else if (interaction.isButton()) {
            return handleButton(interaction)
        }
    }
}