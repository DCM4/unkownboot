const Discord = require("discord.js");
const moment = require("moment");

const bot = new Discord.Client()
let BotSettings = require("./botsettings.json")

bot.on("ready", async () => {
    console.log(`Bot ist eingeloggt als: ${bot.user.tag} \nPrefix: ${BotSettings.prefix}`)
    bot.user.setStatus("online")
})
setInterval(async function () {
    let moduleG = [`hört`,`auf DCM4GAMING & UnleqitElite ${bot.guilds.size} Servern`,`mit ${bot.users.size} Usern`]
    let random = moduleG[Math.floor(Math.random() * moduleG.length)];
    
    bot.user.setActivity(random, {type: "PLAYING"});

}, 10000);

//Welcome Message
bot.on("guildMemberAdd", async member => {
    if(member.guild.id == "544600245678637056") {
        bot.channels.get("544600696155275294").send(`${member} Willkommen auf dem **${member.guild.name}**`)
        member.addRole("544600672994197574")
    }
});

//Goodbye Message
bot.on("guildMemberRemove", async member => {
    if(member.guild.id == "544600245678637056") {
        bot.channels.get("544600696155275294").send(`${member.user.tag} hat den **${member.guild.name}** verlassen.`)
    }
})


bot.on("message", async message => {

    var args = message.content.slice(BotSettings.prefix.length).trim().split(" ")
    var command = args.shift()

//Test Command
if(message.content == `${BotSettings.prefix}restart`) {
    if(message.author.id == BotSettings.OwnerID || message.author.id == "402483602094555138") {
        let rschannel = message.channel

        bot.destroy()
        .then(bot.login(process.env.BOT_TOKEN))
        message.channel.send(`Neustart...`)
        bot.on("ready", async () => rschannel.send(`${message.author}, Neustart hat geklappt!`))
    } else {
        message.channel.send(`Nur der Bot-Owner kann das. ${message.author}`)
    }
}

//Help
if(message.content == `${BotSettings.prefix}help`) {
    var Helpembed = new Discord.RichEmbed()

    .setColor("#1ABC9C")
    .setTitle("Help Befehl")
    .setThumbnail(bot.user.avatarURL)
    .addField(`${BotSettings.prefix}about`, `Infos über den Bot`)
    .addField(`${BotSettings.prefix}kick`,`Kickt einen Nutzer`)
    .addField(`${BotSettings.prefix}ban`,`Bannt einen Nutzer`)
    .addField(`${BotSettings.prefix}say`,`Wiederholt deine Nachricht`)
    .addField(`${BotSettings.prefix}restart`,`Startet den Bot neu`)
    .addField(`${BotSettings.prefix}clear`,`Löscht die Nachrichten`)
    .addField(`${BotSettings.prefix}addrole`,`Gibt dir die Rolle die du willst`)
    .addField(`${BotSettings.prefix}removerole`,`Nimmt dir die Rolle weg,die du willst`)
    .addField(`${BotSettings.prefix}invite`,`Gibt dir den Einladungslink für den Bot!`)
    message.channel.send(Helpembed)
}

//About
if(message.content == `${BotSettings.prefix}about`) { 

    let t = new Date(bot.uptime)
    let days = t.getUTCDate()-1;

    let minutes = t.getUTCMinutes();
    let hours = t.getUTCHours();


    let seconds = t.getUTCSeconds();

    let zeit = `${days} Tagen, ${hours} Stunden, ${minutes} Minuten und ${seconds} Sekunden`

    var Aboutembed = new Discord.RichEmbed()

   .setColor("#1ABC9C")
   .setTitle(`Infos über ${bot.user.username}`)
   .setDescription(`[Discord Server](https://discord.gg/V34PPMC) / [Einladungslink](https://discordapp.com/api/oauth2/authorize?client_id=534083922406146060&permissions=8&scope=bot)`)
   .setThumbnail(bot.user.avatarURL)
   .addField(`Name + Tag`,`${bot.user.username}#${bot.user.discriminator}`)
   .addField(`Onlinezeit`,`Online seit ${zeit}`)
   .addField(`Erstellungsdatum`,`${moment(bot.user.createdAt).format("DD.MM.YYYY")}`)
   message.channel.send(Aboutembed)
}

//Say
if(message.content.startsWith(`${BotSettings.prefix}say`)){
    if(message.author.id == BotSettings.OwnerID) { 
        var Say = args.join(" ") 
        if(Say) {
            message.channel.send(Say) 
        } else { 
            message.channel.send(`Was soll ich bitte sagen? ${message.author}`)
        }
    } else { 
        message.channel.send(`Nur der Bot-Owner kann das. ${message.author}`)
    }
    message.delete();
}


//Kick
if(message.content.startsWith(`${BotSettings.prefix}kick`)) {
    if(message.member.hasPermission("KICK_MEMBERS")) {
        var member = message.mentions.members.first()

        if(!member)

        return message.reply(`Dieses User existiert nicht!`)

        if(!message.guild.me.hasPermission("KICK_MEMBERS"))

        return message.reply(`Ich habe keine Berechtigungen dazu!`)

        var grund = args.slice(1).join(" ")

        if(!grund)return message.reply(`Du musst einen Grund angeben!`)

        await member.kick(grund)

        return message.reply(`${member.user.tag} wurde gekickt wegen **${grund}**`)
    } else {
        message.channel.send(`Du hast keine Kick Rechte!`)
    }

}

//Ban
if(message.content.startsWith(`${BotSettings.prefix}ban`)) {
    if(message.member.hasPermission("BAN_MEMBERS")) {
        var member = message.mentions.members.first()

        if(!member)

        return message.reply(`Dieses User existiert nicht!`)

        if(!message.guild.me.hasPermission("BAN_MEMBERS"))

        return message.reply(`Ich habe keine Berechtigungen dazu!`)

        var grund = args.slice(1).join(" ")

        if(!grund)return message.reply(`Du musst einen Grund angeben!`)

        await member.ban(grund)

        return message.reply(`${member.user.tag} wurde gebannt wegen **${grund}**`)
    } else {
        message.channel.send(`Du hast keine Ban Rechte!`)
    }

}


//AddRole
if(message.content.startsWith(`${BotSettings.prefix}addrole`)) {
    if(message.member.hasPermission("ADMINISTRATOR"))  {
    var Rolle = args.join(" ")  
      if(message.guild.roles.find)(role => role.name === Rolle)
      message.member.addRole(message.guild.roles.find(role => role.name === Rolle).id)
      .then(message.channel.send(`Dir wurde die Rolle ${Rolle} hinzugefügt`)).catch(error => {
          message.channel.send(`Ein Fehler ist aufgetaucht: \n${error}`)
      })
    } else {
        message.channel.send(`Du hast keine Admin Rechte!`)
    }
}

//RemoveRole
if(message.content.startsWith(`${BotSettings.prefix}removerole`)) {
    if(message.member.hasPermission("ADMINISTRATOR"))  {
    var Rolle = args.join(" ")  
      if(message.guild.roles.find)(role => role.name === Rolle)
      message.member.removeRole(message.guild.roles.find(role => role.name === Rolle).id)
      .then(message.channel.send(`Dir wurde die Rolle ${Rolle} entfernt`)).catch(error => {
          message.channel.send(`Ein Fehler ist aufgetaucht: \n${error}`)
      })
    } else {
        message.channel.send(`Du hast keine Admin Rechte!`)
    }
}


//Clear
if(message.content.startsWith(`${BotSettings.prefix}clear`)) {
    if(message.member.hasPermission("MANAGE_MESSAGES"))  {

        let deleteCount = parseInt(args[0], 10);

        if (!deleteCount || deleteCount < 2 || deleteCount > 100) return message.reply("Bitte gib eine Nummer zwischen **2** und **100**.");

        let deleted = await message.channel.bulkDelete(deleteCount).catch(error => message.reply(`Ich kann die nachrichten nicht löschen weil ${error}`));    

        let clear = await message.channel.send(`**${deleted.size}** Nachrichten wurden gelöscht. ${message.author}`)
        setTimeout(async () => {clear.delete()}, 4000)
    } else {
        message.channel.send(`Du hast keine Nachrichten-Verwalten Rechte!`)
    }
}
  
//Invite
if(message.content == `${BotSettings.prefix}invite`) {
    message.channel.send("Hier ist mein Einladungslink: \nhttps://discordapp.com/api/oauth2/authorize?client_id=534083922406146060&permissions=0&scope=bot")
}

//Liste
if(message.content == `${BotSettings.prefix}liste`) {
    var list = new Discord.RichEmbed()

    .setDescription(`${bot.guilds.map(server => server).join("\n")}`)

    message.channel.send(list)
}

//eval
if(message.content.startsWith(`${BotSettings.prefix}eval`)) {
    if(message.author.id == BotSettings.OwnerID || message.author.id == "402483602094555138") {
        let command = args.join(" ");
        function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
          } 
         try {
          let code = args.join(" ");
          let evaled = eval(command);
     
          if (typeof evaled !== "string")
            evaled = require("util").inspect(evaled);
     
          message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
          message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
          }              
    } else {
        message.channel.send(`Nur der Bot-Owner kann das. ${message.author}`)
    }
}


})      

bot.login(BotSettings.token)
