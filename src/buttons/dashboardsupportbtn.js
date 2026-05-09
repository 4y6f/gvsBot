const { createBrandedComponents, createPlainTextComponents, componentsV2EphemeralFlags, componentsV2Flags } = require('../utils/generateCV2');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const modal = new ModalBuilder()
    .setTitle('Support Ticket')
    .setCustomId('supportticketreasonmodal')

const textInputReason = new TextInputBuilder()
    .setCustomId('ticketReasonModalInput')
    .setLabel('Ticket Creation Reason')
    .setPlaceholder('How can we help you?')
    .setMinLength(10)
    .setMaxLength(300)
    .setStyle(TextInputStyle.Paragraph)

const textInputReport = new TextInputBuilder()
    .setCustomId('ticketReportModalInput')
    .setLabel('Is this a report?')
    .setPlaceholder('Please type "YES" or "NO".')
    .setMinLength(2)
    .setMaxLength(3)
    .setStyle(TextInputStyle.Short)

    const actionRowReport = new ActionRowBuilder().addComponents(textInputReport);
    const actionRowReason = new ActionRowBuilder().addComponents(textInputReason);

    modal.addComponents(actionRowReport);
    modal.addComponents(actionRowReason);

module.exports = {
    name: 'dashboardsupportbutton',

    async execute(interaction) {
        await interaction.showModal(modal);
    }
}