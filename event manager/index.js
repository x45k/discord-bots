const { Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
const Discord = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

const process = require('node:process');

process.on('unhandledRejection', async (reason, promise) => {
    console.log('Unhandled rejection at:', promise, 'reason', reason);
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught Expectation:', err);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Exception Monitor:', err, origin);
});

const client = new Discord.Client({

    intents: [

		GatewayIntentBits.Guilds,

		GatewayIntentBits.GuildMessages,

		GatewayIntentBits.MessageContent,

		GatewayIntentBits.GuildMembers,

		GatewayIntentBits.GuildEmojisAndStickers,

		GatewayIntentBits.GuildMessageReactions,

		GatewayIntentBits.DirectMessages,

	],

})

client.on('ready', async () => {
    console.log(`bot is now online as ${client.user.username}`)

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
    });
    client.user.setPresence({ activities: [{ name:` x45k.dev` , type: 3 }] })
})

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath).filter(folder => folder !== '.DS_Store');

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file !== '.DS_Store' && file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on("interactionCreate", async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
 
client.login(process.env.DISCORD_TOKEN)