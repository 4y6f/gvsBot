const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {

        if (interaction.isChatInputCommand()) {

            const command = client.commands.interaction.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);

                const reply = {
                    content: 'there was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        }
        
        else if (interaction.isButton()) {

            const [name] = interaction.customId.split(':');
            const button = client.buttons.get(name);

            if (!button) return;

            try {
                await button.execute(interaction, client);
            } catch (err) {
                console.log('there was an error', err);

                const reply = {
                    content: 'there was an error while executing this button!',
                    flags: MessageFlags.Ephemeral,
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        }
    }
};