const discord = require('discord.js');

const config = require('./config.json');

const client = new discord.Client();

client.once('ready', () => {
    console.log('Ready');
});

var timers = [];

client.on('message', msg => {
    if (!msg.content.startsWith(`${config.prefix}`) || msg.author.bot) return;

    var cmd = msg.content.substr(1).split(' ')[0];
    var args = msg.content.split(' ');
    args.shift();

    if (cmd == "say") {
        msg.channel.send(args[0]);
    }
    else if (cmd == "timer") {
        if (args[0] == "set") {
            var time = Number(args[1]);
            timers.push({
                time_left: time,
                timer_future: null
            });

            msg.channel.send(`Timer ${timers.length}\nTime Left:${time}`).then((timer_msg) => {
                timers[timers.length - 1].timer_msg = timer_msg;
            });
        }
        else if (args[0] == "start") {

            if (args.length != 2) return;

            var timer_index = Number(args[1]);
            var timer = timers[timer_index - 1];

            timer.timer_msg.edit(`Timer ${timers.length}\nTime Left:  ${time_from_seconds(timer.time_left)}`);

            console.log(`Timer ${timer_index} started`);

            timer.timer_future = setInterval(() => {
                if (timer.time_left - 5 >= 0) {
                    timer.time_left -= 5;
                    timer.timer_msg.edit(`Timer ${timers.length}\nTime Left:  ${time_from_seconds(timer.time_left)}`);
                }
                else {
                    timer.timer_msg.edit(`Timer ${timers.length}\nTime Ended`);
                    clearInterval(timer.timer_future);
                }
            }, 5000);
        }
        else if (args[0] == "stop") {
            if (args.length != 2) return;

            var index = Number(args[1]) - 1;

            clearInterval(timers[index].timer_future);

            timers[index].timer_msg.delete();
        }
    }
});

function time_from_seconds(time) {
    return `${Math.floor(time/3600)}:${Math.floor((time/60)) % 60}:${Math.round(time % 60)}`;
}

process.on('exit', () => {
    client.destroy();
});

client.login(config.token);