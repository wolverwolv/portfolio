import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  PermissionFlagsBits
} from 'discord.js';
import { MongoClient, ObjectId } from 'mongodb';

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://Wolverwolv:wolv71950f@minehavenutility.ldyo9.mongodb.net/?appName=MinehavenUtility";

const mongoClient = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log('Bot connected to MongoDB');
  } catch (err) { console.error('DB Error:', err); }
}

async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (err) { return null; }
}

const commands = [
  new SlashCommandBuilder()
    .setName('project')
    .setDescription('Manage projects')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add project')
        .addStringOption(o => o.setName('title').setDescription('Title').setRequired(true))
        .addStringOption(o => o.setName('type').setDescription('Category').setRequired(true))
        .addStringOption(o => o.setName('description').setDescription('Description').setRequired(true))
        .addStringOption(o => o.setName('stats').setDescription('Stats (Comma separated)').setRequired(true))
        .addAttachmentOption(o => o.setName('img1').setDescription('Main Image').setRequired(true))
        .addAttachmentOption(o => o.setName('img2').setDescription('Image 2'))
    )
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Delete project')
        .addStringOption(o => o.setName('id').setDescription('ID').setRequired(true))
    )
].map(c => c.toJSON());

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Bot: ${client.user.tag}`);
  await connectDB();
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try { await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands }); } catch (err) { console.error(err); }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (!db) return interaction.reply('DB not ready');

  if (interaction.commandName === 'project') {
    if (interaction.options.getSubcommand() === 'add') {
      await interaction.deferReply();
      const attachments = [interaction.options.getAttachment('img1'), interaction.options.getAttachment('img2')].filter(Boolean);
      const b64s = [];
      for (const a of attachments) {
        const b = await imageUrlToBase64(a.url);
        if (b) b64s.push(b);
      }

      const project = {
        title: interaction.options.getString('title'),
        type: interaction.options.getString('type'),
        description: interaction.options.getString('description'),
        stats: interaction.options.getString('stats').split(',').map(s => s.trim()),
        images: b64s,
        createdAt: new Date()
      };

      try {
        const res = await db.collection('projects').insertOne(project);
        await interaction.editReply(`✅ Added! ID: ${res.insertedId}`);
      } catch (err) {
        await interaction.editReply(`❌ Error: ${err.message}. Image might be too large!`);
      }
    }

    if (interaction.options.getSubcommand() === 'delete') {
        const id = interaction.options.getString('id');
        try {
          const res = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
          interaction.reply(res.deletedCount ? '🗑️ Deleted' : '❌ Not found');
        } catch { interaction.reply('Invalid ID'); }
    }
  }
});

client.login(TOKEN);
