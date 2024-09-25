const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-event')
        .setDescription('Create a new event')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the event')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description of the event')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Date of the event (YYYY-MM-DD HH:MM)')
                .setRequired(true)),
    async execute(interaction) {
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const date = interaction.options.getString('date');

        const unixTime = Math.floor(new Date(date).getTime() / 1000);
        const eventId = uuidv4();

        const dataPath = path.join(__dirname, '../../data/data.json');

        let data = {};
        if (fs.existsSync(dataPath)) {
            data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        } else {
            data.events = [];
        }

        data.events.push({
            id: eventId,
            title: title,
            description: description,
            unixTime: unixTime
        });

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        await interaction.reply(`Event created! ID: ${eventId}`);
    }
};
