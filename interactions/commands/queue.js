const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType, getVoiceConnection, entersState } = require("@discordjs/voice");
const { SlashCommandBuilder, VoiceState, EmbedBuilder, inlineCode } = require("discord.js");
const ytdl = require("ytdl-core");
const { default: YTMusic } = require("ytmusic-api");
const { getAudioPlayer, getQueue } = require("../../utils/audioPlayers");
const { formatTime } = require("../../utils/formatTime");


module.exports = {
    id: 'command:queue',
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Affiche la liste de lecture.')
        .setDMPermission(false),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.deferReply();

        const { guildId } = interaction;

        const queue = getQueue(guildId);

        if(!queue || queue.length == 0) {
            await interaction.editReply("Aucune musique n'est en cours de lecture.");
        } else {
            const message = queue.map(track => `1. ${inlineCode(track.metadata.title)} de ${inlineCode(track.metadata.artists.join(', '))}`).join('\n');
    
            await interaction.editReply(message);
        }
    }
}