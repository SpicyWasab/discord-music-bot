const { Client } = require('discord.js');
const { readdirSync } = require('fs');
const { token } = require('./config.json');


const client = new Client({
    intents: ['Guilds', 'GuildVoiceStates']
});

client.interactions = new Map();

// load events
readdirSync('./events').forEach(file => {
    const { type, once, callback } = require(`./events/${file}`);

    once ?
        client.once(type, callback) :
        client.on(type, callback);
});

//load interaction handlers
readdirSync('./interactions/').forEach(folder => {
    readdirSync(`./interactions/${folder}`).forEach(file => {
        const { id, execute } = require(`./interactions/${folder}/${file}`);

        client.interactions.set(id, execute);
    });
});

client.login(token);