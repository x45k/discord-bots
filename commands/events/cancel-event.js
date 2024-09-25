const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cancel-event')
        .setDescription('Cancel an existing event')
        .addStringOption(option => 
            option.setName('event-id')
                .setDescription('ID of the event to cancel')
                .setRequired(true)),
    async execute(interaction) {
        const eventId = interaction.options.getString('event-id');

        const dataPath = path.join(__dirname, '../../data/data.json');
        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        const eventIndex = data.events.findIndex(e => e.id === eventId);

        if (eventIndex === -1) {
            return await interaction.reply(`Event with ID ${eventId} not found.`);
        }

        data.events.splice(eventIndex, 1);

        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');

        await interaction.reply(`Event ${eventId} has been canceled.`);
    }
};
