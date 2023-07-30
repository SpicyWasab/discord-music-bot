const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, StreamType, entersState } = require("@discordjs/voice");
const { SlashCommandBuilder, VoiceState, EmbedBuilder, inlineCode, SlashCommandSubcommandBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const { default: YTMusic } = require("ytmusic-api");
const { getAudioPlayer, createAndRegisterAudioPlayer, hasAudioPlayer, setAudioPlayer, removeAudioPlayer, getQueue, createQueue } = require('../../utils/audioPlayers');
const { formatTime } = require('../../utils/formatTime.js')

module.exports = {
    id: 'command:play-playlist',
    data: new SlashCommandBuilder()
        .setName('add-playlist')
        .setDescription('Ajoute une playlist à la liste de lecture (la playlist doit être un lien youtube music).')
        .setDMPermission(false)
        .addStringOption(option =>
            option
                .setName('url')
                .setDescription('Le lien de la playlist (youtube music).')
                .setRequired(true)
        ),
    /**
     * 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.deferReply();

        const { member } = interaction;
        const url = interaction.options.getString('url');

        // fetching music from youtube
        const api = new YTMusic();

        await api.initialize();

        const playlist = await api.getPlaylistVideos(url);

        if(!playlist) return interaction.reply({
            content: "Aucune playlist correspondant à l'url `" + url + "` n'a été trouvée.",
            ephemeral: true
        });

        const firstResult = playlist.shift();

        const metadatas = {
            title: firstResult.name,
            album: firstResult.album?.name,
            artists: firstResult.artists?.map(artist => artist.name),
            thumbnail: firstResult.thumbnails.at(-1).url,
            duration: firstResult.duration,
            url: `https://music.youtube.com/watch?v=${firstResult.videoId}`
        };

        // download from youtube
        const musicStream = ytdl(metadatas.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25, format: 'mp3' });
        const audioResource = createAudioResource(musicStream, {
            metadata: metadatas
        });

        console.log(audioResource.playStream)

        // we're checking if there's already an audio player
        const { guildId } = interaction;
        const hasPlayer = hasAudioPlayer(guildId);

        // if there's already one, just push the queue
        if(hasPlayer) {
            const queue = getQueue(guildId);

            queue.push(audioResource);

            interaction.editReply(`${inlineCode(metadatas.title)} de ${inlineCode(metadatas.artists.join())} a été ajouté à la liste de lecture.`);
        }
        // otherwise, create a queue, fill it with the song, and start playing
        else {
            const queue = createQueue(guildId);
            queue.push(audioResource);

            const player = createAudioPlayer();

            setAudioPlayer(guildId, player);

            // connecting to the voice channel
            /**
             * @type {VoiceState}
             */
            const voiceState = member.voice;

            const connection = joinVoiceChannel({
                channelId: voiceState.channelId,
                guildId: voiceState.guild.id,
                adapterCreator: voiceState.guild.voiceAdapterCreator,
                selfMute: false
            });

            // playing music
            connection.subscribe(player);

            player.play(audioResource);
            metadatas.lastPlayingTimestamp = Date.now();

            player.on(AudioPlayerStatus.Idle, () => {
                const queue = getQueue(guildId);

                // since the first song of the queue ended, we remove it.
                queue.shift();

                console.log(queue);
                
                if(queue.length === 0) {
                    player.stop();
                    removeAudioPlayer(guildId);
                } else {
                    const nextResource = queue[0];
                    player.play(nextResource);
                }
            });
            
            player.on('error', error => {
                console.error('Une erreur est survenue avec le player :');
                console.error(error);
            });

            try {
                await entersState(player, AudioPlayerStatus.Playing, 5_000);
    
                const embed = new EmbedBuilder()
                    .setColor('#8888ff')
                    .setAuthor({ name: metadatas.artists.join() })
                    .setTitle(metadatas.title)
                    .setURL(metadatas.url)
                    .setThumbnail(metadatas.thumbnail)
                    .setDescription(inlineCode('00:00 ' + ''.padStart(20, '▱') + ' ' + formatTime(metadatas.duration)));

                await interaction.editReply({
                    embeds: [ embed ]
                });
            } catch(error) {
                console.error('There was an error trying to start the player', error);
                interaction.editReply('Une erreur est survenue.').catch(console.error);
            }
        }

        // push the queue with the remaining tracks
        

        /*player.on(AudioPlayerStatus.Playing, () => {
            console.log('The audio player has started playing!');

            const embedTitle = metadatas.title; //+ (metadatas.album != undefined ? ' - ' + metadatas.album : '');
            const embedAuthorName = metadatas.artists.join();

            const embed = new EmbedBuilder()
                .setColor('#8888ff')
                .setAuthor({
                    name: embedAuthorName
                })
                .setTitle(embedTitle)
                .setDescription(`Durée : ${metadatas.duration} secondes`)
                .setThumbnail(metadatas.thumbnail);

            interaction.editReply({ 
                embeds: [ embed ]
            }).catch(console.error);
        });*/
    }
}