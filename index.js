import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder, // Keep EmbedBuilder for potential future use or announcements
  PermissionFlagsBits
} from 'discord.js';
import { MongoClient, ObjectId } from 'mongodb';

// --- CONFIGURATION ---
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://Wolverwolv:wolv71950f@minehavenutility.ldyo9.mongodb.net/?appName=MinehavenUtility";
const ANNOUNCEMENT_CHANNEL_ID = process.env.ANNOUNCEMENT_CHANNEL_ID; // Optional: for public announcements

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
  // Project Command
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
        // Limiting to 2 images for project to avoid MongoDB document size limits
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
        .setDescription('Add a new client review (Saved to DB)')
        .addStringOption(opt => opt.setName('name').setDescription('The name of the client.').setRequired(true))
        .addStringOption(opt => opt.setName('role').setDescription('The role/title of the client.').setRequired(true))
        .addIntegerOption(opt => opt.setName('rating').setDescription('The rating (1-5 stars).').setRequired(true).setMinValue(1).setMaxValue(5))
        .addStringOption(opt => opt.setName('date').setDescription('Optional: Date of the review (e.g., "1 month ago").').setRequired(true))
        .addAttachmentOption(opt => opt.setName('screenshot').setDescription('Review screenshot.').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('delete')
        .setDescription('Delete a review.')
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
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('Commands registered successfully!');
  } catch (err) {
    console.error('Command Registration Error:', err);
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
      const attachments = [
        options.getAttachment('img1'),
        options.getAttachment('img2')
      ].filter(Boolean); // Filter out nulls

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
        createdAt: new Date(),
      };

      try {
        const result = await db.collection('projects').insertOne(project);
        await interaction.editReply(`✅ Project Added! ID: ${result.insertedId}`);
        // Optional: Send embed to announcement channel
        // const embed = new EmbedBuilder().setTitle(`New Project: ${project.title}`).setDescription(project.description).setImage(base64Images[0]).setColor(0x0099ff);
        // const channel = await client.channels.fetch(ANNOUNCEMENT_CHANNEL_ID).catch(() => null);
        // if (channel) channel.send({ embeds: [embed] });
      } catch (error) {
        console.error('Error adding project:', error);
        await interaction.editReply({ content: `❌ Failed to add project: ${error.message}. Image(s) might be too large!`, ephemeral: true });
      }
    } else if (sub === 'delete') {
      const id = options.getString('id');
      try {
        const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
        interaction.reply({ content: result.deletedCount ? '🗑️ Project Deleted!' : '❌ Project not found.', ephemeral: true });
      } catch (error) {
        console.error('Error deleting project:', error);
        interaction.reply({ content: '❌ Invalid ID format or database error.', ephemeral: true });
      }
    }
  } else if (commandName === 'review') {
    const sub = options.getSubcommand();

    if (sub === 'add') {
      await interaction.deferReply();
      const screenshotAttachment = options.getAttachment('screenshot');
      const base64Image = await imageUrlToBase64(screenshotAttachment.url);

      if (!base64Image) {
        return interaction.editReply({ content: '❌ Failed to convert image to Base64. Review not added.', ephemeral: true });
      }

      const review = {
        name: options.getString('name'),
        role: options.getString('role'),
        rating: options.getInteger('rating'),
        date: options.getString('date'),
        image: base64Image,
        createdAt: new Date(),
      };

      try {
        const result = await db.collection('reviews').insertOne(review);
        await interaction.editReply(`✅ Review Added! ID: ${result.insertedId}`);
        // Optional: Send embed to announcement channel
        // const embed = new EmbedBuilder().setTitle(`New Review from ${review.name}`).setDescription(`Rating: ${'⭐'.repeat(review.rating)}`).setThumbnail(base64Image).setColor(0x00ff99);
        // const channel = await client.channels.fetch(ANNOUNCEMENT_CHANNEL_ID).catch(() => null);
        // if (channel) channel.send({ embeds: [embed] });
      } catch (error) {
        console.error('Error adding review:', error);
        await interaction.editReply({ content: `❌ Failed to add review: ${error.message}. Image might be too large!`, ephemeral: true });
      }
    } else if (sub === 'delete') {
      const id = options.getString('id');
      try {
        const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
        interaction.reply({ content: result.deletedCount ? '🗑️ Review Deleted!' : '❌ Review not found.', ephemeral: true });
      } catch (error) {
        console.error('Error deleting review:', error);
        interaction.reply({ content: '❌ Invalid ID format or database error.', ephemeral: true });
      }
    }
  }
});

client.login(TOKEN);
