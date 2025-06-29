import { log } from '../vite';
// This is a mock MongoDB implementation for environments without MongoDB
// It provides in-memory storage for basic CRUD operations

// Internal in-memory storage
const collections: Record<string, any[]> = {};

// Mock ObjectId generator
export class ObjectId {
  private id: string;
  
  constructor(id?: string) {
    this.id = id || Math.random().toString(36).substr(2, 9);
  }
  
  toString() {
    return this.id;
  }
  
  toHexString() {
    return this.id;
  }
}

// Connection function
export async function connectToMongoDB() {
  log("Using mock MongoDB implementation");
  return true;
}

export async function getMongoClient() {
  return {
    client: null,
    db: {
      collection: (name: string) => ({
        find: (query = {}, options = {}) => ({
          toArray: () => Promise.resolve(findInCollection(name, query))
        }),
        findOne: (query = {}) => Promise.resolve(findOneInCollection(name, query)),
        insertOne: (doc: any) => Promise.resolve(insertInCollection(name, doc)),
        insertMany: (docs: any[]) => Promise.resolve(insertManyInCollection(name, docs)),
        updateOne: (query: any, update: any) => Promise.resolve(updateInCollection(name, query, update)),
        deleteOne: (query: any) => Promise.resolve(deleteFromCollection(name, query))
      })
    },
    isConnected: true
  };
}

// Helper functions
function initCollection(name: string) {
  if (!collections[name]) {
    collections[name] = [];
  }
  return collections[name];
}

function findInCollection(collectionName: string, query: any) {
  const collection = initCollection(collectionName);
  // Simple query matching (only supports exact matches)
  return collection.filter(item => {
    for (const key in query) {
      if (item[key] !== query[key]) {
        return false;
      }
    }
    return true;
  });
}

function findOneInCollection(collectionName: string, query: any) {
  const results = findInCollection(collectionName, query);
  return results.length > 0 ? results[0] : null;
}

function insertInCollection(collectionName: string, document: any) {
  const collection = initCollection(collectionName);
  if (!document._id) {
    document._id = new ObjectId();
  }
  collection.push(document);
  return {
    acknowledged: true,
    insertedId: document._id
  };
}

function insertManyInCollection(collectionName: string, documents: any[]) {
  const insertedIds: Record<string, any> = {};
  documents.forEach((doc, index) => {
    const result = insertInCollection(collectionName, doc);
    insertedIds[index] = result.insertedId;
  });
  return {
    acknowledged: true,
    insertedCount: documents.length,
    insertedIds
  };
}

function updateInCollection(collectionName: string, query: any, update: any) {
  const collection = initCollection(collectionName);
  let modifiedCount = 0;
  
  collection.forEach((item, index) => {
    let matches = true;
    for (const key in query) {
      if (item[key] !== query[key]) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      for (const key in update.$set) {
        collection[index][key] = update.$set[key];
      }
      modifiedCount++;
    }
  });
  
  return {
    acknowledged: true,
    modifiedCount,
    matchedCount: modifiedCount
  };
}

function deleteFromCollection(collectionName: string, query: any) {
  const collection = initCollection(collectionName);
  const initialLength = collection.length;
  
  const newCollection = collection.filter(item => {
    for (const key in query) {
      if (item[key] !== query[key]) {
        return true;
      }
    }
    return false;
  });
  
  collections[collectionName] = newCollection;
  
  return {
    acknowledged: true,
    deletedCount: initialLength - newCollection.length
  };
}

export async function findDocuments(collection: string, query = {}, options = {}) {
  return findInCollection(collection, query);
}

export async function findOneDocument(collection: string, query = {}) {
  return findOneInCollection(collection, query);
}

export async function insertDocument(collection: string, document: any) {
  return insertInCollection(collection, document);
}

export async function insertManyDocuments(collection: string, documents: any[]) {
  return insertManyInCollection(collection, documents);
}

export async function updateDocument(collection: string, query: any, update: any) {
  return updateInCollection(collection, query, { $set: update });
}

export async function deleteDocument(collection: string, query: any) {
  return deleteFromCollection(collection, query);
}