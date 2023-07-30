module.exports = {
    type: 'ready',
    once: true,
    callback(client) {
        console.log(`Successfully connected as ${client.user.tag}`);
    }
}