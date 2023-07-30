const { AutocompleteInteraction } = require("discord.js");
const YTMusic = require('ytmusic-api').default;

module.exports = {
    id: 'autocomplete:play:query',
    /**
     * 
     * @param {AutocompleteInteraction} interaction 
     */
    async execute(interaction) {
        const query = interaction.options.getFocused();

        try {
            const api = new YTMusic();

            await api.initialize();

            const results = await api.getSearchSuggestions(query);

            const suggestions = results.map(result => {
                return {
                    name: result,
                    value: result
                }
            });

            await interaction.respond(suggestions);
        } catch(error) {
            console.error(error);
        }
    }
}