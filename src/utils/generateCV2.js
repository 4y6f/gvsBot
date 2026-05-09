const {
  ActionRowBuilder,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
} = require("discord.js");
const settings = require("../config/settings");

function imageGallery(url, description = "") {
  return new MediaGalleryBuilder().addItems(
    new MediaGalleryItemBuilder().setURL(url).setDescription(description),
  );
}

function createStatusContainer(text) {
  return [
    new ContainerBuilder().addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`> ${text}`),
    ),
  ];
}

function createBrandedComponents({
  title,
  description,
  actionRows = [],
  linkRows = [],
  includeBanner = true,
  includeFooter = true,
  addSmallSeparatorBeforeActions = true,
}) {
  const container = new ContainerBuilder();
  const hasText = Boolean(title || description);
  const hasActions = actionRows.length > 0;
  const needsBodyGap = includeBanner && (hasText || hasActions || includeFooter);

  if (includeBanner) {
    container.addMediaGalleryComponents(
      imageGallery(settings.bannerImages.general, 'banner'),
    );
  }

  if (needsBodyGap) {
    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
    );
  }

  if (title) {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${title}`),
    );
  }

  if (description) {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(description),
    );
  }

  if (actionRows.length > 0) {
    if (addSmallSeparatorBeforeActions && hasText) {
      container.addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small),
      );
    }

    for (const row of actionRows) {
      if (row instanceof ActionRowBuilder) {
        container.addActionRowComponents(row);
      }
    }
  }

  if (includeFooter) {
    if (includeBanner || hasText || hasActions) {
      container.addSeparatorComponents(
        new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large),
      );
    }
    container.addMediaGalleryComponents(
      imageGallery(settings.footerImages.general, `footer`),
    );
  }

  return [container, ...linkRows];
}

function createFooterOnlyComponents({ title, description, actionRows = [] }) {
  return createBrandedComponents({
    title,
    description,
    actionRows,
    includeBanner: false,
    includeFooter: true,
  });
}

function createPlainTextComponents(text, actionRows = []) {
  const container = new ContainerBuilder().addTextDisplayComponents(
    new TextDisplayBuilder().setContent(text),
  );

  if (actionRows.length > 0) {
    container.addSeparatorComponents(
      new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small),
    );

    for (const row of actionRows) {
      if (row instanceof ActionRowBuilder) {
        container.addActionRowComponents(row);
      }
    }
  }

  return [container];
}

const componentsV2Flags = MessageFlags.IsComponentsV2;
const componentsV2EphemeralFlags =
  MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral;

module.exports = {
  componentsV2Flags,
  componentsV2EphemeralFlags,
  createBrandedComponents,
  createFooterOnlyComponents,
  createPlainTextComponents,
};
