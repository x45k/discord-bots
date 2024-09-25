const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('event-poll')
        .setDescription('Create a poll to vote on event times')
        .addStringOption(option => 
            option.setName('question')
                .setDescription('The question for the poll')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option1')
                .setDescription('First option')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option2')
                .setDescription('Second option')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('option3')
                .setDescription('Third option (optional)')
                .setRequired(false)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const option1 = interaction.options.getString('option1');
        const option2 = interaction.options.getString('option2');
        const option3 = interaction.options.getString('option3') || null;

        let pollMessage = `**${question}**\n1️⃣: ${option1}\n2️⃣: ${option2}`;
        if (option3) pollMessage += `\n3️⃣: ${option3}`;

        const message = await interaction.reply({ content: pollMessage, fetchReply: true });

        await message.react('1️⃣');
        await message.react('2️⃣');
        if (option3) await message.react('3️⃣');
    }
};
