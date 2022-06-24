import ComponentEvent from "../utils/ComponentEvent";
import config from "../config";

export const event = new ComponentEvent(
  "modpingrole_button",
  async (interaction, client) => {
    await interaction.deferUpdate();

    const guild = client.guilds.get(interaction.guildID ?? "");
    const member = guild?.members.find(
      (m) => m.id === interaction.member?.user.id
    );

    if (!guild || !member) {
      void interaction.createFollowup(
        "I cannot find the guild or the member in my cache."
      );
      return;
    }

    let hasRole: boolean;
    if (member?.roles.includes(config.ModPingRoleID)) {
      await member.removeRole(config.ModPingRoleID);
      hasRole = false;
    } else {
      await member?.addRole(config.ModPingRoleID);
      hasRole = true;
    }
    await interaction.editOriginalMessage({
      content: "Click the button below to add/remove the ModPing role!",
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              label: "ModPing Role",
              style: hasRole ? 1 : 2,
              custom_id: "modpingrole_button",
              disabled: false,
            },
          ],
        },
      ],
    });
  }
);
