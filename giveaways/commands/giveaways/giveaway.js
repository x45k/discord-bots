const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const ms = require('ms');

function readData() {
    const filePath = path.join(__dirname, '../../data/data.json');
    if (!fs.existsSync(filePath)) {
        return { giveaways: {} };
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeData(data) {
    const filePath = path.join(__dirname, '../../data/data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Starts a new giveaway')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the giveaway')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description of the giveaway')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Time for the giveaway to end (e.g., 1h, 30m)')
                .setRequired(true)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const description = interaction.options.getString('description');
        const durationInput = interaction.options.getString('duration');

        if (!durationInput) {
            return interaction.reply({ content: 'Please provide a valid time format (e.g., 1h, 30m).', ephemeral: true });
        }

        const duration = ms(durationInput);

        if (typeof duration !== 'number' || isNaN(duration) || duration <= 0) {
            return interaction.reply({ content: 'Please provide a valid time format (e.g., 1h, 30m).', ephemeral: true });
        }

        const endTime = Date.now() + duration;
        const endTimeUnix = Math.floor(endTime / 1000);

        const embed = new EmbedBuilder()
            .setTitle(name)
            .setDescription(`**Description:**\n${description}\n\n**Ends:**\n<t:${endTimeUnix}>`)
            .setColor('Aqua')
            .setFooter({ text: 'Giveaway ends' });

        const button = new ButtonBuilder()
            .setCustomId('giveaway-entry')
            .setLabel('Enter Giveaway')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        const giveawayMessage = await interaction.reply({
            embeds: [embed],
            components: [row],
            fetchReply: true
        });

        const data = readData();
        const giveawayId = giveawayMessage.id;

        if (!data.giveaways[giveawayId]) {
            data.giveaways[giveawayId] = { entries: [] };
        }

        const giveaway = data.giveaways[giveawayId];

        const filter = i => i.customId === 'giveaway-entry' && !i.user.bot;
        const collector = giveawayMessage.createMessageComponentCollector({ filter, time: duration });

        collector.on('collect', async i => {
            const userId = i.user.id;
            const userIndex = giveaway.entries.indexOf(userId);

            if (userIndex === -1) {
                giveaway.entries.push(userId);
                writeData(data);
                await i.reply({ content: 'You have successfully entered the giveaway!', ephemeral: true });
            } else {
                giveaway.entries.splice(userIndex, 1);
                writeData(data);
                await i.reply({ content: 'You have been removed from the giveaway.', ephemeral: true });
            }
        });

        collector.on('end', async () => {
            const winnerId = giveaway.entries[Math.floor(Math.random() * giveaway.entries.length)];
            const winner = winnerId ? `<@${winnerId}>` : 'No one';
            await interaction.followUp({ content: `The giveaway has ended! The winner is: ${winner}` });

            delete data.giveaways[giveawayId];
            writeData(data);
        });
    },
};
