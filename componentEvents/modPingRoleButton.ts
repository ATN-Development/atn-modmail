import ComponentEvent from "../utils/ComponentEvent";
import config from "../config";

export default new ComponentEvent(
  "modpingrole_button",
  async (interaction, client) => {
    await interaction.deferUpdate(
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
                  style: interaction.member.roles.includes(config.ModPingRoleID)
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

    const guild = client.guilds.get(interaction.guildId);
    const member = guild?.members.find(
      (m) => m.id === interaction.member.user.id
    );
    let hasRole: boolean;
    if (member?.roles.includes(config.ModPingRoleID)) {
      await member?.removeRole(config.ModPingRoleID);
      hasRole = false;
    } else {
      await member?.addRole(config.ModPingRoleID);
      hasRole = true;
    }
    await interaction.followUp(
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
                  style: hasRole ? 1 : 2,
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
  }
);
