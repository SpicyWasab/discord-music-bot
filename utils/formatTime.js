module.exports = {
    formatTime(s) {
        let secondsRemaining = s;

        const hours = Math.trunc(secondsRemaining / 3600);
        secondsRemaining %= 3600;

        const minutes = Math.trunc(secondsRemaining / 60);
        secondsRemaining %= 60;

        const seconds = secondsRemaining;

        return (hours != 0 ? hours.toString().padStart(2, 0) + ':' : '') + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
    }
}