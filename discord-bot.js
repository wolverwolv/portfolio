import 'dotenv/config';
import { Client, GatewayIntentBits, Events, REST, Routes, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { MongoClient } from 'mongodb';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[API Request] ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB Cluster
const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;

mongoClient.connect()
  .then(() => {
    console.log('Connected to MongoDB');
    db = mongoClient.db();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/reviews', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const reviews = await db.collection('reviews').find().sort({ createdAt: -1 }).toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const projects = await db.collection('projects').find().sort({ createdAt: -1 }).toArray();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', database: !!db });
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start API Server (Required for hosting to keep the bot alive)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Bot & API running on port ${PORT}`));

// Define Slash Commands
const commands = [
  new SlashCommandBuilder()
    .setName('addproject')
    .setDescription('Add a new project to the portfolio')
    .addStringOption(option => option.setName('title').setDescription('Project Title').setRequired(true))
    .addStringOption(option => option.setName('type').setDescription('Project Type').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Project Description').setRequired(true))
    .addStringOption(option => option.setName('stats').setDescription('Stats (comma separated)').setRequired(true))
    .addAttachmentOption(option => option.setName('image1').setDescription('Main Image').setRequired(true))
    .addAttachmentOption(option => option.setName('image2').setDescription('Additional Image').setRequired(false))
    .addAttachmentOption(option => option.setName('image3').setDescription('Additional Image').setRequired(false)),
  new SlashCommandBuilder()
    .setName('addreview')
    .setDescription('Add a new client review')
    .addStringOption(option => option.setName('name').setDescription('Client Name').setRequired(true))
    .addStringOption(option => option.setName('role').setDescription('Client Role').setRequired(true))
    .addStringOption(option => option.setName('content').setDescription('Review Content').setRequired(true))
    .addIntegerOption(option => option.setName('rating').setDescription('Rating (1-5)').setRequired(true))
    .addAttachmentOption(option => option.setName('image').setDescription('Client Avatar').setRequired(false)),
  new SlashCommandBuilder()
    .setName('syncprojects')
    .setDescription('Post all unposted projects to the showcase channel'),
  new SlashCommandBuilder()
    .setName('deleteproject')
    .setDescription('Delete a project by title')
    .addStringOption(option => option.setName('title').setDescription('The title of the project to delete').setRequired(true)),
  new SlashCommandBuilder()
    .setName('deletereview')
    .setDescription('Delete a review by client name')
    .addStringOption(option => option.setName('name').setDescription('The name of the client who left the review').setRequired(true))
].map(command => command.toJSON());

// Initialize Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once(Events.ClientReady, async c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${c.user.id}&permissions=8&scope=bot%20applications.commands`;
  console.log(`🔗 Invite Link: ${inviteLink}`);

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(c.user.id),
      { body: commands },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'addproject') {
    await interaction.deferReply();
    
    const title = interaction.options.getString('title');
    const type = interaction.options.getString('type');
    const description = interaction.options.getString('description');
    const stats = interaction.options.getString('stats').split(',').map(s => s.trim());
    
    const images = [];
    if (interaction.options.getAttachment('image1')) images.push(interaction.options.getAttachment('image1').url);
    if (interaction.options.getAttachment('image2')) images.push(interaction.options.getAttachment('image2').url);
    if (interaction.options.getAttachment('image3')) images.push(interaction.options.getAttachment('image3').url);

    try {
      const newProject = {
        title,
        type,
        description,
        stats,
        images,
        createdAt: new Date()
      };
      const result = await db.collection('projects').insertOne(newProject);
      await postProjectToChannel(client, newProject);
      await db.collection('projects').updateOne({ _id: result.insertedId }, { $set: { posted: true } });
      await interaction.editReply('✅ Project added to portfolio successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      await interaction.editReply('❌ Error adding project to database.');
    }
  }

  if (interaction.commandName === 'addreview') {
    await interaction.deferReply();

    const name = interaction.options.getString('name');
    const role = interaction.options.getString('role');
    const content = interaction.options.getString('content');
    const rating = interaction.options.getInteger('rating');
    const attachment = interaction.options.getAttachment('image');
    
    const image = attachment ? attachment.url : "https://placehold.co/600x400/1e1e1e/FFF?text=Review";
    
    try {
      const newReview = {
        name,
        role,
        content,
        rating,
        image,
        date: new Date().toLocaleDateString(),
        createdAt: new Date()
      };
      await db.collection('reviews').insertOne(newReview);
      await interaction.editReply('✅ Review added to website successfully!');
    } catch (error) {
      console.error('Error saving review:', error);
      await interaction.editReply('❌ Error adding review to database.');
    }
  }

  if (interaction.commandName === 'syncprojects') {
    await interaction.deferReply();

    if (!db) {
      return interaction.editReply('❌ Database not connected. Check server logs.');
    }

    try {
      const projects = await db.collection('projects').find({ posted: { $ne: true } }).toArray();
      let count = 0;
      
      for (const project of projects) {
        const success = await postProjectToChannel(client, project);
        if (success) {
          await db.collection('projects').updateOne({ _id: project._id }, { $set: { posted: true } });
          count++;
        }
      }
      
      await interaction.editReply(`✅ Synced ${count} projects to the showcase channel.`);
    } catch (error) {
      console.error('Error syncing projects:', error);
      await interaction.editReply('❌ Error syncing projects.');
    }
  }

  if (interaction.commandName === 'deleteproject') {
    await interaction.deferReply();

    if (!db) {
      return interaction.editReply('❌ Database not connected. Check server logs.');
    }

    const title = interaction.options.getString('title');

    try {
      const result = await db.collection('projects').deleteOne({ title });
      if (result.deletedCount > 0) {
        await interaction.editReply(`✅ Project "**${title}**" deleted successfully.`);
      } else {
        await interaction.editReply(`❌ No project found with title "**${title}**".`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      await interaction.editReply('❌ Error deleting project.');
    }
  }

  if (interaction.commandName === 'deletereview') {
    await interaction.deferReply();

    if (!db) {
      return interaction.editReply('❌ Database not connected. Check server logs.');
    }

    const name = interaction.options.getString('name');

    try {
      const result = await db.collection('reviews').deleteOne({ name });
      if (result.deletedCount > 0) {
        await interaction.editReply(`✅ Review from "**${name}**" deleted successfully.`);
      } else {
        await interaction.editReply(`❌ No review found from "**${name}**".`);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      await interaction.editReply('❌ Error deleting review.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

async function postProjectToChannel(client, project) {
  const channelId = '1314864100597043200';
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return false;

    const embed = new EmbedBuilder()
      .setTitle(project.title)
      .setDescription(project.description)
      .setColor(0x5227FF)
      .addFields(
        { name: 'Type', value: project.type, inline: true },
        { name: 'Stats', value: project.stats.join('\n'), inline: true }
      )
      .setTimestamp(project.createdAt);

    if (project.images && project.images.length > 0) {
      embed.setImage(project.images[0]);
    }

    await channel.send({ embeds: [embed] });
    return true;
  } catch (error) {
    console.error('Error posting to channel:', error);
    return false;
  }
}