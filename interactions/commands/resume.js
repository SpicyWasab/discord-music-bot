const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType, getVoiceConnection, entersState } = require("@discordjs/voice");
const { SlashCommandBuilder, VoiceState, EmbedBuilder, inlineCode } = require("discord.js");
const ytdl = require("ytdl-core");
const { default: YTMusic } = require("ytmusic-api");
const { getAudioPlayer, getQueue } = require("../../utils/audioPlayers");
const { formatTime } = require("../../utils/formatTime");


module.exports = {
    id: 'command:resume',
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Relance la musique en cours de lecture si le lecteur est en pause.')
        .setDMPermission(false),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.deferReply();

        const { guildId } = interaction;

        const player = getAudioPlayer(guildId);

        if(!player) {
            await interaction.deferReply("Aucune musique n'est en cours de lecture.");
        } else {
            player.unpause();

            try {
                await entersState(player, AudioPlayerStatus.Playing, 5_000);

                await interaction.editReply('Musique relancée.');
            } catch(error) {
                console.error('There was an error unpausing the player : ', error);

                await interaction.editReply('Une erreur est survenue.')
            }
        }
    }
}