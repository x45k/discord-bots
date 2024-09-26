const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('Get a random fact!'),
    async execute(interaction) {
        try {
            const response = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random');
            
            const fact = response.data.text;
            const sourceUrl = response.data.source_url;
            
            let replyMessage = fact;
            if (sourceUrl) {
                replyMessage += `\n[Source](${sourceUrl})`;
            }
            
            await interaction.reply(replyMessage);
        } catch (error) {
            console.error(error);
            await interaction.reply('Sorry, I could not fetch a fact at this time.');
        }
    }
};
