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
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

// --- CONFIGURATION ---
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const MONGO_URI = process.env.MONGODB_URI;
const ANNOUNCEMENT_CHANNEL_ID = process.env.ANNOUNCEMENT_CHANNEL_ID;
const APP_URL = process.env.APP_URL || ''; // Your website URL (e.g. https://your-site.com)

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

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

// --- UTILS ---
async function downloadImage(url, prefix) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type');
    const extension = contentType ? contentType.split('/')[1] : 'png';
    const filename = `${prefix}-${Date.now()}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, filename);

    const fileStream = fs.createWriteStream(filePath);
    await pipeline(response.body, fileStream);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Download Error:', err);
    return null;
  }
}

// --- COMMAND DEFINITIONS ---
const commands = [
  // Project Command
  new SlashCommandBuilder()
    .setName('project')
    .setDescription('Manage portfolio projects')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add a new project')
        .addStringOption(opt => opt.setName('title').setDescription('Project Title').setRequired(true))
        .addStringOption(opt => opt.setName('type').setDescription('Category (e.g. Modding, Art)').setRequired(true))
        .addStringOption(opt => opt.setName('description').setDescription('Project description').setRequired(true))
        .addStringOption(opt => opt.setName('stats').setDescription('Comma separated stats (e.g. 100+ downloads, 4.5 rating)').setRequired(true))
        .addAttachmentOption(opt => opt.setName('img1').setDescription('Primary Image').setRequired(true))
        .addAttachmentOption(opt => opt.setName('img2').setDescription('Second Image'))
        .addAttachmentOption(opt => opt.setName('img3').setDescription('Third Image'))
        .addAttachmentOption(opt => opt.setName('img4').setDescription('Fourth Image'))
        .addAttachmentOption(opt => opt.setName('img5').setDescription('Fifth Image'))
    )
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Delete a project')
        .addStringOption(opt => opt.setName('id').setDescription('Project MongoDB ID').setRequired(true))
    ),

  // Review Command
  new SlashCommandBuilder()
    .setName('review')
    .setDescription('Manage client reviews')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Add a new review')
        .addStringOption(opt => opt.setName('name').setDescription('Client Name').setRequired(true))
        .addStringOption(opt => opt.setName('role').setDescription('Client Role (e.g. Server Owner)').setRequired(true))
        .addIntegerOption(opt => opt.setName('rating').setDescription('Rating 1-5').setRequired(true).setMinValue(1).setMaxValue(5))
        .addStringOption(opt => opt.setName('date').setDescription('Display Date (e.g. 2 weeks ago)').setRequired(true))
        .addAttachmentOption(opt => opt.setName('screenshot').setDescription('Review Screenshot').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Delete a review')
        .addStringOption(opt => opt.setName('id').setDescription('Review MongoDB ID').setRequired(true))
    )
].map(command => command.toJSON());

// --- BOT LOGIC ---
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  console.log(`Bot logged in as ${client.user.tag}`);
  await connectDB();

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    console.log('Registering commands...');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('Commands registered successfully!');
  } catch (err) {
    console.error('Registration Error:', err);
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (!db) return interaction.reply({ content: 'Database not connected!', ephemeral: true });

  const { commandName, options } = interaction;

  if (commandName === 'project') {
    const sub = options.getSubcommand();

    if (sub === 'add') {
      await interaction.deferReply();
      const title = options.getString('title');
      const type = options.getString('type');
      const description = options.getString('description');
      const stats = options.getString('stats').split(',').map(s => s.trim());

      const attachments = [
        options.getAttachment('img1'),
        options.getAttachment('img2'),
        options.getAttachment('img3'),
        options.getAttachment('img4'),
        options.getAttachment('img5')
      ].filter(Boolean);

      const imageUrls = [];
      for (let i = 0; i < attachments.length; i++) {
        const localPath = await downloadImage(attachments[i].url, `project-${title.replace(/\s+/g, '-')}-${i}`);
        if (localPath) imageUrls.push(localPath);
      }

      const project = { title, type, description, stats, images: imageUrls, createdAt: new Date() };
      const result = await db.collection('projects').insertOne(project);

      const embed = new EmbedBuilder()
        .setTitle(`🚀 New Project: ${title}`)
        .setDescription(description)
        .addFields(
          { name: '📂 Category', value: type, inline: true },
          { name: '📊 Stats', value: stats.join(' • '), inline: true },
          { name: '🆔 ID', value: result.insertedId.toString() }
        )
        .setColor('#00ffcc')
        .setTimestamp();

      if (imageUrls.length > 0) {
        embed.setImage(`${APP_URL}${imageUrls[0]}`);
      }

      await interaction.editReply({ content: 'Project added successfully!' });

      const channel = await client.channels.fetch(ANNOUNCEMENT_CHANNEL_ID).catch(() => null);
      if (channel) channel.send({ embeds: [embed] });
    }

    if (sub === 'delete') {
      const id = options.getString('id');
      try {
        const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
        interaction.reply({ content: result.deletedCount ? 'Project deleted!' : 'Project not found.', ephemeral: true });
      } catch {
        interaction.reply({ content: 'Invalid ID format.', ephemeral: true });
      }
    }
  }

  if (commandName === 'review') {
    const sub = options.getSubcommand();

    if (sub === 'add') {
      await interaction.deferReply();
      const name = options.getString('name');
      const role = options.getString('role');
      const rating = options.getInteger('rating');
      const date = options.getString('date');
      const screenshot = options.getAttachment('screenshot');

      const localPath = await downloadImage(screenshot.url, `review-${name.replace(/\s+/g, '-')}`);

      const review = { name, role, rating, date, image: localPath || screenshot.url, createdAt: new Date() };
      const result = await db.collection('reviews').insertOne(review);

      const embed = new EmbedBuilder()
        .setTitle(`⭐ New Review from ${name}`)
        .setDescription(`${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`)
        .addFields(
          { name: '👤 Role', value: role, inline: true },
          { name: '📅 Date', value: date, inline: true },
          { name: '🆔 ID', value: result.insertedId.toString() }
        )
        .setColor('#ffcc00')
        .setThumbnail(`${APP_URL}${localPath}`)
        .setTimestamp();

      await interaction.editReply({ content: 'Review added successfully!' });

      const channel = await client.channels.fetch(ANNOUNCEMENT_CHANNEL_ID).catch(() => null);
      if (channel) channel.send({ embeds: [embed] });
    }

    if (sub === 'delete') {
      const id = options.getString('id');
      try {
        const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
        interaction.reply({ content: result.deletedCount ? 'Review deleted!' : 'Review not found.', ephemeral: true });
      } catch {
        interaction.reply({ content: 'Invalid ID format.', ephemeral: true });
      }
    }
  }
});

client.login(TOKEN);
