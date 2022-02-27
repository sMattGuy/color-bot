const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changecolor')
		.setDescription('Changes the color of the role specified')
		.addRoleOption(option => 
			option.setName('role')
				.setDescription('Please select your role, typing any other will not work!')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('hex')
				.setDescription('The hex of the color you want, typed as #FFFFFF')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply({'content':'Please wait...','ephemeral':true});
		const role = interaction.options.getRole('role');
		const hex = interaction.options.getString('hex');
		const guildRoles = interaction.guild.roles;
		const usersRoles = interaction.member.roles.cache;
		const user = interaction.member;
		const foundRole = await guildRoles.fetch(role.id)
													 .then(foundRole => {return foundRole})
													 .catch(await interaction.editReply({'content':'Invalid role selected!','ephemeral':true}));
													 
		if(usersRoles.some(urole => urole.id == role.id)){
			if(foundRole.members.size != 1){
				await interaction.editReply({'content':'Invalid role selected!','ephemeral':true});
				return;
			}
		}
		else{
			await interaction.editReply({'content':'Invalid role selected!','ephemeral':true});
			return;
		}
		
		const hexregex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
		if(!hexregex.test(hex)){
			await interaction.editReply({'content':'Invalid hex color given!','ephemeral':true});
			return;
		}
		
		//everything is validated, time to update the role
		await foundRole.edit({"color":hex}).then(() => {
			interaction.editReply({'content':`Your color has been updated to ${hex}!`,'ephemeral':true});
		}).catch(error => {
			console.error(error);
			interaction.editReply({'content':'Something went wrong updating the color!','ephemeral':true});
			return;
		});
	},
};