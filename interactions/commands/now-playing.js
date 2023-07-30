const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, StreamType, getVoiceConnection } = require("@discordjs/voice");
const { SlashCommandBuilder, VoiceState, EmbedBuilder, inlineCode } = require("discord.js");
const ytdl = require("ytdl-core");
const { default: YTMusic } = require("ytmusic-api");
const { getAudioPlayer, getQueue } = require("../../utils/audioPlayers");
const { formatTime } = require("../../utils/formatTime");


module.exports = {
    id: 'command:now-playing',
    data: new SlashCommandBuilder()
        .setName('now-playing')
        .setDescription('Affiche la musique en cours de lecture.')
        .setDMPermission(false),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.deferReply();

        const { guildId } = interaction;

        const queue = getQueue(guildId);
        
        console.info(queue);

        if(!queue || queue.length === 0) {
            interaction.editReply('Aucune musique n\'est actuellement en cours de lecture.');
        } else {
            const currentSong = queue.at(0);
            const nextSong = queue.at(1);

            const elapsedTime = Math.trunc(currentSong.playbackDuration / 1000);
            const songDuration = currentSong.metadata.duration;
            const progress = Math.round((elapsedTime / songDuration) * 20); // 20 is the length of the progress bar
            const progressBar = inlineCode(formatTime(elapsedTime) + ' ' + '▰'.repeat(progress).padEnd(20, '▱') + ' ' + formatTime(songDuration))

            const embed = new EmbedBuilder()
                .setColor('#8888ff')
                .setAuthor({ name: currentSong.metadata.artists.join() })
                .setTitle(currentSong.metadata.title)
                .setURL(currentSong.metadata.url)
                .setThumbnail(currentSong.metadata.thumbnail)
                .setDescription(progressBar);

            if(nextSong != undefined) {
                embed.setFooter({
                    text: `Titre suivant : ${nextSong.metadata.title} ⸱ ${nextSong.metadata.artists.join(', ')}`,
                    iconURL: nextSong.metadata.thumbnail
                });
            }

            await interaction.editReply({
                embeds: [ embed ]
            });
        }

    }
}