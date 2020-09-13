const Discord = require('discord.js');
const bot = new Discord.Client();
const client = new Discord.Client()
bot.commands = new Discord.Collection();
const fs = require('fs');
const config = require("./botconfig.json")
let token = config.token;
let prefix = config.prefix;
let profile = require('./profile.json')


fs.readdir('./cmds/', (err,files)=>{
    if(err) console.log(err);
    let jsfiles = files.filter(f => f.split(".").pop() === "js" );
    if(jsfiles.length <=0) console.log("Неизвестная комманда!");
    console.log(`Загружено ${jsfiles.length} комманд`);
    jsfiles.forEach((f,i) =>{
        let props = require(`./cmds//${f}`);
        console.log(`${i+1}.${f} Загружен!`);
        bot.commands.set(props.help.name,props);
    
    });
});


bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite(["ADMINISTRATOR"]).then(link =>{
        console.log(link);
    });
});


bot.on('message', async message => {
    if(message.author.bot) 
    if(message.channel.type == "dm") return 
    let uid = message.author.id;
    bot.send = function (msg){
        message.channel.send(msg);
    };

    fs.writeFile('./profile.json',JSON.stringify(profile),(err)=>{
       if(err) console.log(err);
    });

    let user = message.author.username
    let userid = message.author.id
    let messageArray = message.content.split(" ")
    let command = messageArray[0].toLowerCase()
    let args = messageArray.slice(1)
    if(!message.content.startsWith(prefix)) return
    if(!message.member) message.member = await message.guild.fetchMemer(message);
    let cmd = bot.commands.get(command.slice(prefix.length))
    if(cmd) cmd.run(bot,message,args)

  })
      
  bot.login(token);
