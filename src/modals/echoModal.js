const settings = require('../config/settings');
const { createPlainTextComponents, componentsV2Flags } = require('../utils/generateCV2');

module.exports = {
    name: 'echoUserInput',

    async execute(interaction, client) {

        const userInput = interaction.fields.getTextInputValue('echoInput');

            const echoContainer = createPlainTextComponents(userInput)
            await interaction.reply({ flags: componentsV2Flags, components: echoContainer});
    }
}