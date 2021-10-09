import config from "../config";
import { SlashCommand } from "../utils/SlashCommand";

export default new SlashCommand(
  "modping",
  async (interaction, client) => {
    try {
      await interaction.ephemeralReply(
        {
          data: {
            content: "Click the button below to add/remove the ModPing role!",
            components: [
              {
                type: 1,
                components: [
                  {
                    type: 2,
                    label: "ModPing Role",
                    style: interaction.member.roles.includes(
                      config.ModPingRoleID
                    )
                      ? 1
                      : 2,
                    custom_id: "modpingrole_button",
                    disabled: false,
                  },
                ],
              },
            ],
          },
        },
        client
      );
    } catch (err: any) {
      console.log(`Error: ${err.message}`);
    }
  },
  {
    custom: (interaction, client) => {
      if (!interaction.member.roles.includes(config.ModeratorRoleID)) {
        interaction.ephemeralReply(
          "Only moderators can run this command.",
          client
        );
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
