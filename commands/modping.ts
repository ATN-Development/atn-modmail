import config from "../config";
import { Command } from "../utils/Command";

export default new Command(
  ["modping", "mp"],
  async (message) => {
    if (message.member?.roles.includes(config.ModPingRoleID)) {
      await message.member?.removeRole(config.ModPingRoleID);
      await message.channel.createMessage(
        "Succesfully removed the ModMail Ping role."
      );
    } else {
      await message.member?.addRole(config.ModPingRoleID);
      await message.channel.createMessage(
        "Succesfully added the ModMail Ping role."
      );
    }
  },
  {
    custom: (message) => {
      if (message.channel.type !== 0) {
        return false;
      } else {
        if (!message.member?.roles.includes(config.ModeratorRoleID)) {
          message.channel.createMessage(
            "You must be a Moderator to use this command."
          );
          return false;
        }
        return true;
      }
    },
  }
);
