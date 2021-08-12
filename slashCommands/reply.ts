// import fs from 'fs';
// import path from 'path';
import { SlashCommand } from "../utils/SlashCommand";

export default new SlashCommand('reply', async (interaction, client) => {
  await interaction.deferWithSource(undefined, client)
  // const user = client.users.get(interaction.member.user.id)
  // const dm = await user?.getDMChannel()
  console.log(interaction.data.options?interaction.data.options[0]:'ok')
  
  // fs.appendFile(path.join(__dirname, "..", "transcripts", `${user?.id}.txt`), `\n${interaction.member.user.username}${interaction.member.user.discriminator}: ${interaction}`)
}, undefined, {
  options: [
    {
      type: 3,
      name: "message",
      description: "The message you want to send.",
      required: true
    }
  ],
  default_permission: true,
  description: "Reply to a ModMail thread.",
})