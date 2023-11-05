import { Client, Constants } from '@projectdysnomia/dysnomia';
import { readFile } from 'fs/promises';


let token = process.env.TOKEN;

if (!token) {
    console.log('No token found in environment, checking for token file...');
    token = await readFile('./token', 'utf-8')
        .catch((e) => console.error('Error reading token file:', e));
} else {
    console.log('Token found in environment');
}

if (!token) {
    console.error('No token found! Exiting...');
    process.exit(1);
}

if (!token.startsWith('Bot ')) {
    token = `Bot ${token}`;
}

const client = new Client(token, {
    gateway: {
        intents: [
            'guilds',
            'guildMessageReactions'
        ]
    }
});

client.on('ready', () => {
    console.log(`Ready as ${client.user.username}#${client.user.discriminator}`);
    client.editStatus('online', {
        name: 'for super reactions',
        type: Constants.ActivityTypes.WATCHING,
    });
});

client.on('messageReactionAdd', (msg, emoji, reactor, isBurst) => {
    if (!isBurst) return;
    const perms = msg.channel?.permissionsOf?.(client.user.id);
    let emojiID = emoji.id ? `${emoji.name}:${emoji.id}` : emoji.name;
    if (!perms?.has(Constants.Permissions.manageMessages) || !perms?.has(Constants.Permissions.readMessageHistory)) return;
    client.removeMessageReaction(msg.channel.id, msg.id, emojiID, reactor.id).catch((err) => {
        console.error(err);
    });
});

client.connect();