const { createAudioPlayer, AudioPlayer } = require("@discordjs/voice");

// in case there's multiple guilds
const players = new Map();
const queues = new Map();

module.exports = {
    /**
     * 
     * @param {String} guildId 
     * @returns {AudioPlayer}
     */
    getAudioPlayer(guildId) {
        return players.get(guildId);
    },

    /**
     * 
     * @param {String} guildId 
     * @param  {AudioPlayer} player 
     */
    setAudioPlayer(guildId, player) {
        players.set(guildId, player);
    },

    hasAudioPlayer(guildId) {
        return players.has(guildId);
    },

    removeAudioPlayer(guildId) {
        players.delete(guildId);
    },

    createQueue(guildId) {
        const queue = [];
        queues.set(guildId, queue);

        return queue;
    },

    getQueue(guildId) {
        return queues.get(guildId);
    }
}

/*
class Queue

class customAudioPlayer extends AudioPlayer {
    constructor(...args) {
        super(...args);
    }

    play(audioResource) {
        super(audioResource)
    }
}



/**
 * @param {CreateAudioPlayerOptions} options 
 * @returns {customAudioPlayer}
 */
/*
export function createAudioPlayer(options) {
	return new customAudioPlayer(options);
}*/