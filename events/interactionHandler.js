module.exports = {
    type: 'interactionCreate',
    /**
     * 
     * @param {import("discord.js").Interaction} interaction 
     */
    async callback(interaction) {
        const { client } = interaction;

        if(interaction.isAutocomplete) console.log(interaction);

        let execute;

        if(interaction.isChatInputCommand()) {
            const { commandName } = interaction;

            execute = client.interactions.get(`command:${commandName}`);
        } else if(interaction.isAutocomplete()) {
            const { commandName } = interaction;
            const optionName = interaction.options.data.find(o => o.focused).name;

            console.log(interaction.version)

            execute = client.interactions.get(`autocomplete:${commandName}:${optionName}`)
        }

        try {
            await execute(interaction);
        } catch(error) {
            console.error(`Une erreur est survenue (commande : ${interaction?.commandName} ; customId : ${interaction?.customId})`);
            console.error(error);
        }
    }
}