import {
  ComponentType,
  ContainerBuilder,
  TopLevelComponent
} from "discord.js";

import { ButtonHandler } from "@core/registry/component";
import { Logger } from "@core/logger";
import { build } from "../containers/birthdayContainer";

const handler: ButtonHandler = {
  async execute({ interaction }) {
    try {
      await interaction.deferUpdate(); // Acknowledge immediately

      const newComponents: (TopLevelComponent | ContainerBuilder)[] = [];

      for (const component of interaction.message.components) {
        if (component.type === ComponentType.Container) {
          const container = await build(
            interaction.guild!,
            interaction.channelId,
            { old: component, buttonId: interaction.customId }
          );

          if (!container) {
            interaction.followUp({
              content: "Woah! Sorry, there are too many gifts!"
            });
            return;
          }

          newComponents.push(container);
        }
        else newComponents.push(component);
      }

      await interaction.editReply({ components: newComponents });

      Logger.debug(`Gift added to birthday message`);
    }
    catch (error) {
      Logger.error(`Failed to add birthday gift: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
};

export default handler;
