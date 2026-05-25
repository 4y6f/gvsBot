const { MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { createBrandedComponents, componentsV2Flags, createPlainTextComponents } = require("../utils/generateCV2");
const { votersArray } = require("../localdata/data");

module.exports = {
  name: "sessionvotebtn",

  async execute(interaction) {
    const requiredVotes = parseInt(interaction.customId.split(':')[1]) || 5;

    if (justReachedGoal) {
        await interaction.channel.send({
        flags: componentsV2Flags,
        components: voteSuccessMsg,
        });
    }

    if (votersArray.includes(interaction.user.id)) {
      return await interaction.reply({
        content: "You've already voted for this session.",
        flags: MessageFlags.Ephemeral,
      });
    }

    votersArray.push(interaction.user.id);

    const currentVotes = votersArray.length;
    const goalReached = currentVotes >= requiredVotes;
    const justReachedGoal = currentVotes === requiredVotes;

    const voteBtn = new ButtonBuilder()
      .setLabel("Vote")
      .setCustomId("sessionvotebtn")
      .setStyle(ButtonStyle.Secondary);

    const votersBtn = new ButtonBuilder()
      .setLabel(`Voters: ${votersArray.length}`)
      .setCustomId("sessionvotersbtn")
      .setStyle(goalReached ? ButtonStyle.Success : ButtonStyle.Danger)
      .setDisabled(true);

    const voteBtnActionRow = new ActionRowBuilder().addComponents(voteBtn, votersBtn);

    const voteContainer = createBrandedComponents({
      title: "Session Vote",
      description: `A staff member has started a session vote. If you would like to start a session, vote using the button below.`,
      actionRows: [voteBtnActionRow],
    });

    await interaction.message.edit({
      flags: componentsV2Flags,
      components: voteContainer,
    });

    const voteSuccessMsg = createPlainTextComponents(`We've reached our goal of ${requiredVotes}! A session may now begin.`);

    return await interaction.reply({
      content: "You've voted for the session.",
      flags: MessageFlags.Ephemeral,
    });
  },
};
