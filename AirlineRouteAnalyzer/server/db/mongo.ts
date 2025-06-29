import { MongoClient, ServerApiVersion } from 'mongodb';

// Replace with your own connection string if needed
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/airline-analyzer";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Set a timeout for the connection attempt
  connectTimeoutMS: 5000,
});

let db: any = null;
let isConnected = false;

export async function connectToMongoDB() {
  try {
    // Connect the client to the server with a timeout
    await client.connect();
    
    console.log("Connected successfully to MongoDB server");
    
    // Get the database
    db = client.db("airline-analyzer");
    isConnected = true;
    
    return db;
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    console.log("Application will run without MongoDB functionality");
    // Don't throw the error - allow the application to continue
    isConnected = false;
    return null;
  }
}

export async function getMongoClient() {
  if (!isConnected && !db) {
    await connectToMongoDB();
  }
  return { client, db, isConnected };
}

// Helper functions for common operations
export async function findDocuments(collection: string, query = {}, options = {}) {
  const { db, isConnected } = await getMongoClient();
  if (!isConnected || !db) return [];
  return db.collection(collection).find(query, options).toArray();
}

export async function findOneDocument(collection: string, query = {}) {
  const { db, isConnected } = await getMongoClient();
  if (!isConnected || !db) return null;
  return db.collection(collection).findOne(query);
}

export async function insertDocument(collection: string, document: any) {
  const { db, isConnected } = await getMongoClient();
  if (!isConnected || !db) {
    console.log(`MongoDB not connected. Could not insert document into ${collection}`);
    return { acknowledged: false, insertedId: null };
  }
  return db.collection(collection).insertOne(document);
}

export async function insertManyDocuments(collection: string, documents: any[]) {
  const { db, isConnected } = await getMongoClient();
  if (!isConnected || !db) {
    console.log(`MongoDB not connected. Could not insert documents into ${collection}`);
    return { acknowledged: false, insertedCount: 0, insertedIds: {} };
  }
  return db.collection(collection).insertMany(documents);
}

export async function updateDocument(collection: string, query: any, update: any) {
  const { db, isConnected } = await getMongoClient();
  if (!isConnected || !db) {
    console.log(`MongoDB not connected. Could not update document in ${collection}`);
    return { acknowledged: false, modifiedCount: 0, matchedCount: 0 };
  }
  return db.collection(collection).updateOne(query, { $set: update });
}

export async function deleteDocument(collection: string, query: any) {
  const { db, isConnected } = await getMongoClient();
  if (!isConnected || !db) {
    console.log(`MongoDB not connected. Could not delete document from ${collection}`);
    return { acknowledged: false, deletedCount: 0 };
  }
  return db.collection(collection).deleteOne(query);
}

// Ensure proper cleanup on application shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log("MongoDB connection closed through app termination");
  process.exit(0);
});