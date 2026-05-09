const { MediaGalleryComponent, MediaGalleryItemBuilder, SelectMenuOptionBuilder, StringSelectMenuBuilder, StringSelectMenuComponent, StringSelectMenuOptionBuilder, MessageFlags, ContainerBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SectionBuilder, TextDisplayBuilder, MediaGalleryBuilder, SeparatorBuilder, SeparatorSpacingSize } = require('discord.js');
const { hasPermission, permissionReply } = require('../../utils/permissionChecker');
const settings = require('../../config/settings');

const components  = [
    new ContainerBuilder()
        .addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(settings.bannerImages.general)
                    )
                )
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('### Dashboard')
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
        )
        .addSectionComponents(
            new SectionBuilder()
                .setButtonAccessory(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel('Support')
                        .setCustomId('dashboardsupportbutton')
                )
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent('have questions about our server or need assistance?')
                ),
        )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
        )
        .addActionRowComponents(
            new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('dashboardstringselect')
                        .addOptions(
                            new SelectMenuOptionBuilder()
                                .setLabel('server information')
                                .setValue('dashboardselectwhoweare')
                                .setDescription('learn about us and how we were created.'),

                            new SelectMenuOptionBuilder()
                                .setLabel('server rules')
                                .setValue('dashboardselectrules')
                                .setDescription('learn our server\'s rules to avoid moderation.'),
                            ),
                    ),
            )
        .addSeparatorComponents(
            new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
        )
        .addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(settings.footerImages.general)
                        .setDescription('dashboard footer')
                    ),
            ),
    ]

module.exports = {
    name: 'dashboard',
    aliases: ['dash'],

    async execute(message) {
        await message.channel.send({ flags: MessageFlags.IsComponentsV2, components })
    }
}