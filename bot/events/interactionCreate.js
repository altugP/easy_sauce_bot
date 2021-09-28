// ############################################################################
// Event data and logic.
// ############################################################################
const data = {
    name: 'interactionCreate',
    once: false,
}

// ############################################################################
// Exports.
// ############################################################################
module.exports = {
    name: data.name,
    once: data.once,
    async execute(interaction) {
        // If the interaction is not a command it can be ignored for now.
        if (!interaction.isCommand()) return

        // Fetching the command from the client's `commands` Collection.
        const command = interaction.client.commands.get(interaction.commandName)

        // If the command doesn't exist, something went wrong.
        //? Could have been a deleted command.
        if (!command) return

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(error)
            await interaction.reply({
                content: 'An error occurred while executing this command.',
                ephemeral: true, //? Only visible to the user that called this.
            })
        }
    }
}