const { REST, Routes } = require('discord.js');
const fs = require('fs');

const { clientId, guildId, token } = require('./config.json');

const commands = [];
const commandsPath = './interactions/commands';
const commandFiles = [];

fs.readdirSync(commandsPath).forEach(file => {
	commandFiles.push(`${commandsPath}/${file}`);
});

console.table(commandFiles);

for (const file of commandFiles) {
	const command = require(file);

	commands.push(command.data.toJSON());
}

const rest = new REST().setToken(token);
(async () => {
	try {
		console.log(`[MUSIC-BOT] Demarrage du déploiement de ${commands.length} commande(s)`);
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);
		console.log(`[MUSIC-BOT] Succès du déploiment de ${data.length} commande(s)`);
	} catch (error) {
		console.error('[MUSIC-BOT] Une erreur est survenue au moment du déploiment :');
		console.error(error);
	}
})();