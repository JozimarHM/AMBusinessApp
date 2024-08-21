import * as FileSystem from 'expo-file-system';

const dbPath = `${FileSystem.documentDirectory}SQLite/notas.db`;
const backupPath = `${FileSystem.documentDirectory}Backup/notasBackup.db`;
const dbProductsPath = `${FileSystem.documentDirectory}SQLite/products.db`;
const backupProductsPath = `${FileSystem.documentDirectory}Backup/productsBackup.db`;

export async function backupDatabase() {
  try {
    const backupDir = `${FileSystem.documentDirectory}Backup`;
    const dirInfo = await FileSystem.getInfoAsync(backupDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(backupDir);
    }

    await FileSystem.copyAsync({
      from: dbPath,
      to: backupPath,
    });
    console.log('Backup Notas realizado com sucesso !');
  } catch (error) {
    console.error('Erro ao realizar o backup:', error);
  }
  try {
    const backupDir = `${FileSystem.documentDirectory}Backup`;
    const dirInfo = await FileSystem.getInfoAsync(backupDir);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(backupDir);
    }

    await FileSystem.copyAsync({
      from: dbProductsPath,
      to: backupProductsPath,
    });
    console.log('Backup Produtos realizado com sucesso!');
  } catch (error) {
    console.error('Erro ao realizar o backup:', error);
  }
}

export async function restoreDatabase() {
  try {
    const backupInfo = await FileSystem.getInfoAsync(backupPath);
    if (backupInfo.exists) {
      await FileSystem.copyAsync({
        from: backupPath,
        to: dbPath,
      });
      console.log('Banco de dados Nota restaurado com sucesso!');
    } else {
      console.log('Nenhum backup encontrado.');
    }
  } catch (error) {
    console.error('Erro ao restaurar o banco de dados Nota:', error);
  }
  try {
    const backupProductsInfo = await FileSystem.getInfoAsync(backupProductsPath);
    if (backupProductsInfo.exists) {
      await FileSystem.copyAsync({
        from: backupProductsPath,
        to: dbProductsPath,
      });
      console.log('Banco de dados Produto restaurado com sucesso!');
    } else {
      console.log('Nenhum backup encontrado.');
    }
  } catch (error) {
    console.error('Erro ao restaurar o banco de dados Produto:', error);
  }
}

  // Função para excluir os backups dos bancos de dados
export async function deleteBackups() {
  try {
    const backupInfo = await FileSystem.getInfoAsync(backupPath);
    if (backupInfo.exists) {
      await FileSystem.deleteAsync(backupPath);
      console.log('Backup do banco de dados Nota excluído com sucesso!');
    } else {
      console.log('Nenhum backup do banco de dados Nota encontrado.');
    }
  } catch (error) {
    console.error('Erro ao excluir o backup do banco de dados Nota:', error);
  }

  try {
    const backupProductsInfo = await FileSystem.getInfoAsync(backupProductsPath);
    if (backupProductsInfo.exists) {
      await FileSystem.deleteAsync(backupProductsPath);
      console.log('Backup do banco de dados Produto excluído com sucesso!');
    } else {
      console.log('Nenhum backup do banco de dados Produto encontrado.');
    }
  } catch (error) {
    console.error('Erro ao excluir o backup do banco de dados Produto:', error);
  }
}