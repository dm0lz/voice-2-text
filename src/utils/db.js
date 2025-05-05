const DB_NAME = 'chatlog';
const STORE_NAME = 'entries';
const DB_VERSION = 1;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject(event.target.error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
        store.createIndex('timestamp', 'timestamp', { unique: true });
      }
    };
  });
};

export const getAllEntries = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error('Error getting entries:', event.target.error);
      reject(event.target.error);
    };
  });
};

export const addEntry = async (entry) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(entry);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error('Error adding entry:', event.target.error);
      reject(event.target.error);
    };
  });
};

export const removeEntry = async (timestamp) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(Number(timestamp));

    request.onsuccess = () => {
      console.log('Entry deleted successfully');
      resolve();
    };

    request.onerror = (event) => {
      console.error('Error removing entry:', event.target.error);
      reject(event.target.error);
    };
  });
}; 