const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edit-event')
        .setDescription('Edit an existing event')
        .addStringOption(option => 
            option.setName('event-id')
                .setDescription('ID of the event to edit')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('title')
                .setDescription('New title of the event')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('date')
                .setDescription('New date of the event (YYYY-MM-DD)')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('time')
                .setDescription('New time of the event (HH:MM in 24-hour format)')
                .setRequired(false))
        .addStringOption(option => 
            option.setName('description')
                .setDescription('New description of the event')
                .setRequired(false)),
    async execute(interaction) {
        const eventId = interaction.options.getString('event-id');
        const title = interaction.options.getString('title');
        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const description = interaction.options.getString('description');

        const dataPath = path.join(__dirname, '../../data/data.json');
        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        const event = data.events.find(e => e.id === eventId);

        if (!event) {
            return await interaction.reply(`Event with ID ${eventId} not found.`);
        }

        if (title) event.title = title;
        if (date && time) {
            const eventDate = new Date(`${date}T${time}:00Z`);
            event.unixTime = Math.floor(eventDate.getTime() / 1000);
        }
        if (description) event.description = description;

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

        await interaction.reply(`Event ${eventId} has been updated!`);
    }
};
