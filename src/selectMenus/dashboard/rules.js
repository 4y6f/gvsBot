const settings = require('../../config/settings');
const { createBrandedComponents, componentsV2EphemeralFlags } = require('../../utils/generateCV2');

const components = createBrandedComponents({
    title: 'regulations',
    description: [
        '1) be respectful to everyone',
        '2) follow directions from staff',
        '3) have fun',
        '-# we can moderate you for any reason deemed reasonable by directive.'
    ].join('\n')
})
module.exports = {
    name: 'dashboardselectrules',

    async execute(interaction) {
        return await interaction.reply({ flags: componentsV2EphemeralFlags, components });
    }
}