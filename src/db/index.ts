import SQLite from 'react-native-sqlite-storage';

// Enable Promise-based API
SQLite.enablePromise(true);

const DB_NAME = 'fitness_app.db';
let db: SQLite.SQLiteDatabase;

export const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
  return db;
};

export const initDatabase = async () => {
  try {
    const database = await getDB();

    // 1. Products Table
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT,
        serving_size TEXT,
        calories REAL,
        protein REAL,
        carbs REAL,
        fat REAL,
        search_terms TEXT
      );
    `);

    // FTS not always enabled by default in Android SQLite builds unless bundled. 
    // We will try standard CREATE VIRTUAL TABLE. If it fails, we catch it.
    try {
      await database.executeSql(`
          CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts4(name, brand, search_terms);
        `);
      // Note: FTS5 might not be available on older Androids, using FTS4 is safer or just LIKE.
    } catch (e) {
      console.warn('FTS not supported, falling back to basic search', e);
    }

    // 2. Daily Logs
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS daily_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        product_id TEXT,
        name TEXT NOT NULL,
        calories REAL,
        protein REAL,
        carbs REAL,
        fat REAL,
        amount_g REAL,
        timestamp INTEGER
      );
    `);

    // 3. User Profile
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY DEFAULT 1,
        weight_kg REAL,
        height_cm REAL,
        age INTEGER,
        gender TEXT,
        activity_level TEXT,
        goal_calories INTEGER DEFAULT 2000,
        goal_protein INTEGER DEFAULT 150,
        goal_carbs INTEGER DEFAULT 200,
        goal_fat INTEGER DEFAULT 65
      );
    `);

    // 4. Weight History
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS weight_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        weight REAL,
        date TEXT NOT NULL
      );
    `);

    // 5. Activity Logs
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        calories_burned REAL,
        steps INTEGER,
        date TEXT NOT NULL
      );
    `);

    // Seed Check
    const [results] = await database.executeSql('SELECT count(*) as count FROM user_profile');
    if (results.rows.item(0).count === 0) {
      await database.executeSql(`
            INSERT INTO user_profile (id, weight_kg, height_cm, age, gender, activity_level)
            VALUES (1, 75, 175, 25, 'male', 'moderate')
        `);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};
