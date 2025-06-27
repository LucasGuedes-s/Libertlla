import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const database_name = 'app.db';
const database_version = '1.0';
const database_displayname = 'App Database';
const database_size = 200000;

let db: SQLite.SQLiteDatabase | null = null;

// Abre o banco e cria a tabela se não existir
export async function initDB() {
  db = await SQLite.openDatabase({
    name: database_name,
    location: 'default',
  });

  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS KeyValue (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );`
  );
}

// Salvar um par chave-valor simples
export async function setItem(key: string, value: string) {
  if (!db) throw new Error('Database not initialized');

  await db.executeSql(
    `REPLACE INTO KeyValue (key, value) VALUES (?, ?)`,
    [key, value]
  );
}

// Ler valor pela chave
export async function getItem(key: string): Promise<string | null> {
  if (!db) throw new Error('Database not initialized');

  const [result] = await db.executeSql(
    `SELECT value FROM KeyValue WHERE key = ? LIMIT 1`,
    [key]
  );

  if (result.rows.length > 0) {
    return result.rows.item(0).value;
  }

  return null;
}
// storage.ts (adicionar no final do arquivo)
export async function saveBluetoothDevice(device: { id: string; name?: string }) {
  return setItem('bluetoothDevice', JSON.stringify(device));
}

export async function getBluetoothDevice(): Promise<{ id: string; name?: string } | null> {
  const json = await getItem('bluetoothDevice');
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Fechar o banco (opcional)
export async function closeDB() {
  if (db) {
    await db.close();
    db = null;
  }
}
