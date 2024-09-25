const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce-event')
        .setDescription('Announce an event to a specific channel')
        .addStringOption(option => 
            option.setName('event-id')
                .setDescription('ID of the event to announce')
                .setRequired(true))
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to announce the event in')
                .setRequired(true)),
    async execute(interaction) {
        const eventId = interaction.options.getString('event-id');
        const targetChannel = interaction.options.getChannel('channel');

        const dataPath = path.join(__dirname, '../../data/data.json');
        let data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

        const event = data.events.find(e => e.id === eventId);

        if (!event) {
            return await interaction.reply(`Event with ID ${eventId} not found.`);
        }

        const announcementMessage = new EmbedBuilder()
        .setTitle(`🎉 ${event.title} 🎉`)
        .setDescription(`**Date:**\n<t:${event.unixTime}>\n\n**Description:**\n${event.description}`)
        .setColor('Red');

        try {
            await targetChannel.send({ embeds: [announcementMessage] });
            await interaction.reply(`Event ${eventId} has been successfully announced in ${targetChannel}.`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`Failed to announce event in the specified channel.`);
        }
    }
};
