const settings = require('../../config/settings');
const { createBrandedComponents, componentsV2EphemeralFlags } = require('../../utils/generateCV2');

const components = createBrandedComponents({
    title: 'About Us',
    description: [
        `Welcome to the ER:LC Government Systems! We were founded on Tue Feb 24 2026 to provide a realistic roleplay exerience for all players to enjoy.`,
        'We strive to create a welcoming and inclusive community.'
    ].join(' ')
})

module.exports = {
    name: 'dashboardselectwhoweare',

    async execute(interaction, client) {
        return await interaction.reply({ flags: componentsV2EphemeralFlags, components });
    }
}