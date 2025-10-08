import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  ContainerComponent,
  Guild,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
  TextDisplayComponent
} from "discord.js";

import { EmojiManager } from "@lib/emojiManager";

const DEFAULT_GIFT_EMOJIS = ["🎁", "🎂", "🎈", "🍰", "🎊", "🎉", "💝", "🌟", "✨", "🎀", "🧁", "🍾", "🥳", "🪅"];
const MAX_GIFTS = 500;

type FromUserIds = { userIds: string[] };
type FromExisting = { old: ContainerComponent; buttonId: string };

export async function build(guild: Guild, channelId: string, options: FromUserIds): Promise<ContainerBuilder>;
export async function build(guild: Guild, channelId: string, options: FromExisting): Promise<ContainerBuilder | null>;
export async function build(
  guild: Guild,
  channelId: string,
  options: FromUserIds | FromExisting
) {
  const container = new ContainerBuilder();
  const message = new TextDisplayBuilder();

  const separator = new SeparatorBuilder()
    .setDivider(true)
    .setSpacing(SeparatorSpacingSize.Large);

  const giftTitle = new TextDisplayBuilder();
  const giftBody = new TextDisplayBuilder();
  const giftBtnArea = new ActionRowBuilder<ButtonBuilder>();

  const button = new ButtonBuilder()
    .setStyle(ButtonStyle.Success)
    .setLabel("Send a Gift")
    .setEmoji({ name: "🎁" });

  const emojis = [
    ...DEFAULT_GIFT_EMOJIS,
    ...(await EmojiManager.getGuildEmojis(guild.id))
  ];

  if ("userIds" in options) {
    const acctMentions = options.userIds.map((u) => `<@${u}>`);
    const acctMentionStr = acctMentions.length === 1
      ? acctMentions.at(0)
      : acctMentions.length === 2
        ? `${acctMentions.at(0)} and ${acctMentions.at(1)}`
        : acctMentions.slice(0, -1).join(", ") + `, and ${acctMentions.at(-1)}`;

    message.setContent(`## Today is ${acctMentionStr}'s birthday!\nHave an amazing birthday  ${EmojiManager.inline("3_")}`);
    giftTitle.setContent("**Gifts Received**");
    giftBody.setContent("-# *No gifts yet! Be the first!*");
    button.setCustomId(`birthday_gift_${channelId}_${Date.now()}`);
  }

  else {
    const _message = options.old.components.at(0)! as TextDisplayComponent;
    const _giftBody = options.old.components.at(3)! as TextDisplayComponent;

    const randomGift = emojis[Math.floor(Math.random() * emojis.length)];
    const giftPattern = new RegExp(emojis.join("|"), "g");
    const oldGifts = _giftBody.content.match(giftPattern) ?? [];

    if (oldGifts.length >= MAX_GIFTS) return null;

    const gifts = oldGifts.length > 0
      ? _giftBody.content + " " + randomGift
      : "> ## " + randomGift;

    message.setContent(_message.content);
    giftTitle.setContent(`**Gifts Received (${oldGifts.length + 1})**`);
    giftBody.setContent(`${gifts}`);
    button.setCustomId(options.buttonId);
  }

  giftBtnArea.addComponents(button);

  container.addTextDisplayComponents(message);
  container.addSeparatorComponents(separator);
  container.addTextDisplayComponents(giftTitle, giftBody);
  container.addActionRowComponents(giftBtnArea);

  return container;
}
