import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { MongoClient, ObjectId } from 'mongodb';

// --- CONFIGURATION ---
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://Wolverwolv:wolv71950f@minehavenutility.ldyo9.mongodb.net/?appName=MinehavenUtility";
const ANNOUNCEMENT_CHANNEL_ID = process.env.ANNOUNCEMENT_CHANNEL_ID;

// --- MONGODB SETUP ---
const mongoClient = new MongoClient(MONGO_URI);
let db;

async function connectDB() {
  try {
    await mongoClient.connect();
    db = mongoClient.db();
    console.log('Bot connected to MongoDB');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
  }
}

// --- IMAGE TO BASE64 UTILS ---
async function imageUrlToBase64(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/png';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('Base64 Conversion Error:', err);
    return null;
  }
}

// --- COMMAND DEFINITIONS ---
const commands = [
  new SlashCommandBuilder()
    .setName('project')
    .setDescription('Manage portfolio projects')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add a new project (Saved to DB)')
        .addStringOption(opt => opt.setName('title').setDescription('Project Title').setRequired(true))
        .addStringOption(opt => opt.setName('type').setDescription('Category').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Description').setRequired(true))
        .addStringOption(opt => opt.setName('stats').setDescription('Stats (Comma separated)').setRequired(true))
        .addAttachmentOption(opt => opt.setName('img1').setDescription('Main Image').setRequired(true))
        .addAttachmentOption(opt => opt.setName('img2').setDescription('Image 2'))
        .addAttachmentOption(opt => opt.setName('img3').setDescription('Image 3'))
    )
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Delete a project')
        .addStringOption(opt => opt.setName('id').setDescription('Project ID').setRequired(true))
    ),
  new SlashCommandBuilder()
    .setName('review')
    .setDescription('Manage reviews')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add a review (Saved to DB)')
        .addStringOption(opt => opt.setName('name').setDescription('Name').setRequired(true))
        .addStringOption(opt => opt.setName('role').setDescription('Role').setRequired(true))
        .addIntegerOption(opt => opt.setName('rating').setDescription('1-5').setRequired(true))
        .addStringOption(opt => opt.setName('date').setDescription('Date text').setRequired(true))
        .addAttachmentOption(opt => opt.setName('screenshot').setDescription('Screenshot').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Delete a review')
        .addStringOption(opt => opt.setName('id').setDescription('Review ID').setRequired(true))
    )
].map(command => command.toJSON());

// --- BOT LOGIC ---
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user.tag}`);
  await connectDB();
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('Commands registered!');
  } catch (err) { console.error(err); }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (!db) return interaction.reply({ content: 'DB error', ephemeral: true });

  const { commandName, options } = interaction;

  if (commandName === 'project') {
    if (options.getSubcommand() === 'add') {
      await interaction.deferReply();
      const attachments = [options.getAttachment('img1'), options.getAttachment('img2'), options.getAttachment('img3')].filter(Boolean);

      const base64Images = [];
      for (const attachment of attachments) {
        const b64 = await imageUrlToBase64(attachment.url);
        if (b64) base64Images.push(b64);
      }

      const project = {
        title: options.getString('title'),
        type: options.getString('type'),
        description: options.getString('description'),
        stats: options.getString('stats').split(',').map(s => s.trim()),
        images: base64Images,
        createdAt: new Date()
      };

      const result = await db.collection('projects').insertOne(project);
      await interaction.editReply(`✅ Project Added! ID: ${result.insertedId}`);
    }
  }

  if (commandName === 'review') {
    if (options.getSubcommand() === 'add') {
      await interaction.deferReply();
      const attachment = options.getAttachment('screenshot');
      const b64 = await imageUrlToBase64(attachment.url);

      const review = {
        name: options.getString('name'),
        role: options.getString('role'),
        rating: options.getInteger('rating'),
        date: options.getString('date'),
        image: b64,
        createdAt: new Date()
      };

      const result = await db.collection('reviews').insertOne(review);
      await interaction.editReply(`✅ Review Added! ID: ${result.insertedId}`);
    }
  }

  // Delete logic remains similar
  if (options.getSubcommand() === 'delete') {
    const id = options.getString('id');
    const collection = commandName === 'project' ? 'projects' : 'reviews';
    try {
      const res = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
      interaction.reply({ content: res.deletedCount ? '🗑️ Deleted!' : '❌ Not found', ephemeral: true });
    } catch { interaction.reply({ content: 'Invalid ID', ephemeral: true }); }
  }
});

client.login(TOKEN);
