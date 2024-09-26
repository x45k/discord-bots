const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll!')
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

        const pollEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Poll')
            .setDescription(`**${question}**\n\n1️⃣: ${option1}\n2️⃣: ${option2}`)
            .setTimestamp();

        if (option3) {
            pollEmbed.setDescription(`1️⃣: ${option1}\n2️⃣: ${option2}\n3️⃣: ${option3}`)
        }

        const message = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        await message.react('1️⃣');
        await message.react('2️⃣');
        if (option3) await message.react('3️⃣');
    }
};
