require('dotenv').config();
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { parseDocx } = require('../src/ocr/docxParser');
const { chunkText } = require('../src/ocr/chunker');
const { getProvider } = require('../src/infrastructure/embeddings');
const QdrantClient = require('../src/infrastructure/vector/qdrantClient');

const DOCS_DIR = path.join(__dirname, '../../docs');
const FILES = [
  'Indian_Government_Schemes_Research_Tabular.docx',
  'Indian_Government_Schemes_Research_Expanded.docx'
];

async function seed() {
  console.log('Initializing Vector Database Client...');
  const qdrant = new QdrantClient();
  const embedder = getProvider();
  
  const collectionName = 'sathix_schemes';
  console.log(`Ensuring collection: ${collectionName} with dim: ${embedder.dim || 384}`);
  
  await qdrant.ensureCollection(collectionName, { size: embedder.dim || 384 });

  for (const filename of FILES) {
    const filePath = path.join(DOCS_DIR, filename);
    console.log(`\nProcessing file: ${filename}`);
    
    try {
      const text = await parseDocx(filePath);
      console.log(`Parsed ${text.length} characters.`);
      
      const chunks = chunkText(text, 250); // ~250 words per chunk
      console.log(`Created ${chunks.length} chunks.`);

      const points = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const embedding = await embedder.embed(chunk);
        
        points.push({
          id: uuidv4(),
          vector: embedding.vector,
          payload: {
            text: chunk,
            source: filename,
            chunk_index: i
          }
        });
      }

      console.log(`Upserting ${points.length} points to Qdrant...`);
      await qdrant.upsert(collectionName, points);
      console.log(`Successfully indexed ${filename}`);
      
    } catch (err) {
      console.error(`Failed to process ${filename}:`, err.message);
    }
  }
  
  console.log('\nSeeding complete.');
}

seed().catch(console.error);
