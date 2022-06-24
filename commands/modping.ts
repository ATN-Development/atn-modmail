import { Constants } from "eris";
import config from "../config";
import { Command } from "../utils/Command";

export const command = new Command(
  "modping",
  async (interaction) => {
    try {
      await interaction.createMessage({
        flags: Constants["MessageFlags"]["EPHEMERAL"],
        content: "Click the button below to add/remove the ModPing role!",
        components: [
          {
            type: 1,
            components: [
              {
                type: Constants["ComponentTypes"]["BUTTON"],
                label: "ModPing Role",
                style: interaction.member?.roles.includes(config.ModPingRoleID)
                  ? 1
                  : 2,
                custom_id: "modpingrole_button",
                disabled: false,
              },
            ],
          },
        ],
      });
    } catch (err) {
      console.log(`Error: ${(err as Error).message}`);
    }
  },
  {
    custom: (interaction) => {
      if (!interaction.member?.roles.includes(config.ModeratorRoleID)) {
        void interaction.createMessage({
          content: "Only moderators can run this command.",
          flags: Constants["MessageFlags"]["EPHEMERAL"],
        });
        return false;
      } else {
        return true;
      }
    },
  },
  {
    description: "Get notified whenever a ModMail thread gets opened.",
  }
);
