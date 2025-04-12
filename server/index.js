import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Helper function to read JSON files
async function readJsonFile(filename) {
  const filePath = join(__dirname, '..', 'data', filename);
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// API endpoints
app.get('/api/data', async (req, res) => {
  try {
    const [accountIndustry, acvRange, customerType, team] = await Promise.all([
      readJsonFile('Account Industry.json'),
      readJsonFile('ACV Range.json'),
      readJsonFile('Customer Type.json'),
      readJsonFile('Team.json'),
    ]);

    res.json({
      accountIndustry,
      acvRange,
      customerType,
      team,
    });
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});