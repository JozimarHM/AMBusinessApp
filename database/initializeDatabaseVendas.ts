import { type SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabaseVendas(database: SQLiteDatabase) {
  await database.execAsync(`
    /* DROP TABLE notas; */
    CREATE TABLE IF NOT EXISTS notas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tel TEXT NOT NULL,
      title TEXT NOT NULL,
      nota TEXT NOT NULL,
      valor TEXT NOT NULL,
      pago TEXT NOT NULL,
      date TEXT NOT NULL,
      pinned INTEGER NOT NULL,
      cor TEXT NOT NULL,
      valorParcial TEXT NOT NULL,
      valorRestante TEXT NOT NULL,
      corTexto TEXT,
      parcela INTEGER 
    );
  `).catch((erro) => {
    console.log(erro);
  });

  await database.execAsync(`
    /*DROP TABLE products; */
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT NOT NULL,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      quantity INTEGER NOT NULL
    );
  `).catch((erro) => {
    console.log(erro);
  });


  // await database.execAsync(`
  //   CREATE TABLE IF NOT EXISTS parcelas (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     nota_id INTEGER NOT NULL,
  //     numero_parcela INTEGER NOT NULL,
  //     valor_parcela TEXT NOT NULL,
  //     FOREIGN KEY (nota_id) REFERENCES notas(id)
  //   );
  // `).catch((erro) => {
  //   console.log(erro);
  // })
}