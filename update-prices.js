const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '673ebe09000b35b67d8b';
const DATABASE_ID = '6740474900354338e949';
// Sahi ID: 6740476000250285528835b3 (Pehle wali mein beech ke numbers missing the)
const COLLECTION_ID = '674047600025528835b3'; 
const API_KEY = 'standard_a953b450306d6a7988ca5965b1615e55d4930f9fa69f25b8bda1d1fdf8c068ad2ea3d75c4dfe636c2efcb54f3423991aa4462d8d19f1ecf62c23e816d556f34cd2ec28bba561eeceb7d0841f745e90037ed3dc425b359113509608eaded739a5a9b0978af96a02323ff4de140a1e90d3e0949283668d6367e3d5b49e31a5c1ac';
const INCREASE_PERCENT = -10;

const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': PROJECT_ID,
  'X-Appwrite-Key': API_KEY,
};

async function getAllDocuments() {
  // सीधा 100 की लिमिट लगा दी ताकि offset का लफड़ा ही न रहे
  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents?limit=100`,
    { headers }
  );
  const data = await res.json();
  
  if (data.documents) {
    return data.documents;
  }
  return [];
}
async function updatePrice(docId, oldPrice) {
  const currentPrice = Number(oldPrice);
  if (isNaN(currentPrice)) {
    console.log(`✗ ${docId} | Error: Invalid number (${oldPrice})`);
    return;
  }

  const newPriceValue = Math.round(currentPrice * (1 + INCREASE_PERCENT / 100));
  const newPriceStr = String(newPriceValue);

  const res = await fetch(
    `${ENDPOINT}/databases/${DATABASE_ID}/collections/${COLLECTION_ID}/documents/${docId}`,
    {
      method: 'PATCH',
      headers,
      // Appwrite ko 'data' wrapper ke andar field chahiye hoti hai
      body: JSON.stringify({ 
        data: {
          price: newPriceStr 
        }
      }), 
    }
  );
  
  const data = await res.json();
  // Appwrite successful update par pure document ka data return karta hai
  if (data.$id) {
    console.log(`✓ ${docId} | ₹${oldPrice} → ₹${newPriceStr}`);
  } else {
    console.log(`✗ ${docId} | Error:`, JSON.stringify(data));
  }
}

async function main() {
  console.log('Fetching all products...\n');
  const docs = await getAllDocuments();
  
  if (docs.length === 0) {
    console.log('Koi products nahi mile. ID ek baar dashboard se copy karke check karo.');
    return;
  }

  console.log(`Found ${docs.length} products. Updating prices (+${INCREASE_PERCENT}%)...\n`);

  for (const doc of docs) {
    if (doc.price == null) {
      console.log(`- Skipped ${doc.$id} (no price field)`);
      continue;
    }
    await updatePrice(doc.$id, doc.price);
  }

  console.log('\nDone! Ab localhost check karo.');
}

main();
