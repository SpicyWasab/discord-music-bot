const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType, getVoiceConnection, entersState } = require("@discordjs/voice");
const { SlashCommandBuilder, VoiceState, EmbedBuilder, inlineCode } = require("discord.js");
const ytdl = require("ytdl-core");
const { default: YTMusic } = require("ytmusic-api");
const { getAudioPlayer, getQueue, removeAudioPlayer } = require("../../utils/audioPlayers");
const { formatTime } = require("../../utils/formatTime");


module.exports = {
    id: 'command:skip',
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Lance la musique suivante.')
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
            const queue = getQueue(guildId);
    
            console.info(queue);

            // on passe la musique en cours
            queue.shift();
    
            console.info(queue);

            const nextSong = queue.at(0);

            console.info(nextSong);

            if(!nextSong) {
                player.stop();
                removeAudioPlayer(guildId);

                await interaction.editReply(`Aucune musique à jouer.`);
            } else {
                // on joue la musique suivante
                player.play(nextSong);
        
                try {
                    await entersState(player, AudioPlayerStatus.Playing, 5_000);
        
                    await interaction.editReply(`${inlineCode(nextSong.metadata.title)} de ${inlineCode(nextSong.metadata.artists.join(', '))} en cours de lecture.`);
                } catch(error) {
                    console.error('There was an error pausing the player : ', error);
        
                    await interaction.editReply('Une erreur est survenue.')
                }
            }

        }
    }
}