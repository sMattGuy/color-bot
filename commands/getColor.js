const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('getcolor')
		.setDescription('Gets the color of the role specified')
		.addRoleOption(option => 
			option.setName('role')
				.setDescription('Please select your role, typing any other will not work!')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply({'content':'Please wait...','ephemeral':true});
		
		const role = interaction.options.getRole('role');
		
		const guildRoles = interaction.guild.roles;
		const usersRoles = interaction.member.roles.cache;
		const user = interaction.member;
		
		const foundRole = await guildRoles.fetch(role.id)
			.then(foundRole => {return foundRole});
													 
    if(foundRole.members.size != 1){
      await interaction.editReply({'content':'Invalid role selected!','ephemeral':true});
      return;
    }
			
		//everything is validated, time to update the role
		let color = foundRole.hexColor;
		let rolename = foundRole.name;
		interaction.editReply({'content':`The color of ${rolename} is ${color}`,'ephemeral':true});
	},
};
