const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reaction-role')
        .setDescription('Add a reaction role!')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to display with the buttons')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('button_count')
                .setDescription('Number of buttons to create')
                .setRequired(true)
                .addChoices(
                    { name: '1', value: 1 },
                    { name: '2', value: 2 },
                    { name: '3', value: 3 }
                ))
        .addStringOption(option =>
            option.setName('button_1_text')
                .setDescription('Text for button 1')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('button_1_color')
                .setDescription('Color for button 1')
                .setRequired(true)
                .addChoices(
                    { name: 'Primary', value: 'PRIMARY' },
                    { name: 'Secondary', value: 'SECONDARY' },
                    { name: 'Success', value: 'SUCCESS' },
                    { name: 'Danger', value: 'DANGER' }
                ))
        .addRoleOption(option =>
            option.setName('button_1_role')
                .setDescription('Role to give for button 1')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('button_2_text')
                .setDescription('Text for button 2')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('button_2_color')
                .setDescription('Color for button 2')
                .setRequired(false)
                .addChoices(
                    { name: 'Primary', value: 'PRIMARY' },
                    { name: 'Secondary', value: 'SECONDARY' },
                    { name: 'Success', value: 'SUCCESS' },
                    { name: 'Danger', value: 'DANGER' }
                ))
        .addRoleOption(option =>
            option.setName('button_2_role')
                .setDescription('Role to give for button 2')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('button_3_text')
                .setDescription('Text for button 3')
                .setRequired(false))
        .addStringOption(option =>
            option.setName('button_3_color')
                .setDescription('Color for button 3')
                .setRequired(false)
                .addChoices(
                    { name: 'Primary', value: 'PRIMARY' },
                    { name: 'Secondary', value: 'SECONDARY' },
                    { name: 'Success', value: 'SUCCESS' },
                    { name: 'Danger', value: 'DANGER' }
                ))
        .addRoleOption(option =>
            option.setName('button_3_role')
                .setDescription('Role to give for button 3')
                .setRequired(false)),

    async execute(interaction) {
        const messageText = interaction.options.getString('message');
        const buttonCount = interaction.options.getInteger('button_count');

        const buttons = [];
        
        const button1 = new ButtonBuilder()
            .setCustomId('button_1')
            .setLabel(interaction.options.getString('button_1_text'))
            .setStyle(ButtonStyle[interaction.options.getString('button_1_color')]);
        buttons.push(button1);

        if (buttonCount >= 2) {
            const button2 = new ButtonBuilder()
                .setCustomId('button_2')
                .setLabel(interaction.options.getString('button_2_text'))
                .setStyle(ButtonStyle[interaction.options.getString('button_2_color')]);
            buttons.push(button2);
        }

        if (buttonCount === 3) {
            const button3 = new ButtonBuilder()
                .setCustomId('button_3')
                .setLabel(interaction.options.getString('button_3_text'))
                .setStyle(ButtonStyle[interaction.options.getString('button_3_color')]);
            buttons.push(button3);
        }

        const row = new ActionRowBuilder().addComponents(buttons);

        await interaction.reply({ content: messageText, components: [row] });

        const filter = i => i.customId.startsWith('button_') && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'button_1') {
                const role = interaction.options.getRole('button_1_role');
                await interaction.member.roles.add(role);
            } else if (i.customId === 'button_2') {
                const role = interaction.options.getRole('button_2_role');
                await interaction.member.roles.add(role);
            } else if (i.customId === 'button_3') {
                const role = interaction.options.getRole('button_3_role');
                await interaction.member.roles.add(role);
            }
        });

        collector.on('end', collected => console.log(`Collected ${collected.size} interactions.`));
    }
};
