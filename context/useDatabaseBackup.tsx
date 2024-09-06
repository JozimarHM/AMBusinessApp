import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { Alert } from 'react-native';

const dbPath = `${FileSystem.documentDirectory}SQLite/notas.db`;
const backupPath = `${FileSystem.documentDirectory}Backup/notasBackup.db`;
// const dbProductsPath = `${FileSystem.documentDirectory}SQLite/products.db`;
// const backupProductsPath = `${FileSystem.documentDirectory}Backup/productsBackup.db`;

//FUNÇÃO PARA REALIZAR O BACKUP LOCALMENTE
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
  // try {
  //   const backupDir = `${FileSystem.documentDirectory}Backup`;
  //   const dirInfo = await FileSystem.getInfoAsync(backupDir);

  //   if (!dirInfo.exists) {
  //     await FileSystem.makeDirectoryAsync(backupDir);
  //   }

  //   await FileSystem.copyAsync({
  //     from: dbProductsPath,
  //     to: backupProductsPath,
  //   });
  //   console.log('Backup Produtos realizado com sucesso!');
  // } catch (error) {
  //   console.error('Erro ao realizar o backup:', error);
  // }
}

//FUNÇÃO PARA RESTAURAR O BACKUP LOCALMENTE
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
  // try {
  //   const backupProductsInfo = await FileSystem.getInfoAsync(backupProductsPath);
  //   if (backupProductsInfo.exists) {
  //     await FileSystem.copyAsync({
  //       from: backupProductsPath,
  //       to: dbProductsPath,
  //     });
  //     console.log('Banco de dados Produto restaurado com sucesso!');
  //   } else {
  //     console.log('Nenhum backup encontrado.');
  //   }
  // } catch (error) {
  //   console.error('Erro ao restaurar o banco de dados Produto:', error);
  // }
}

// FUNÇÃO PARA EXCLUIR O BACKUP SALVO LOCALMENTE
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

  // try {
  //   const backupProductsInfo = await FileSystem.getInfoAsync(backupProductsPath);
  //   if (backupProductsInfo.exists) {
  //     await FileSystem.deleteAsync(backupProductsPath);
  //     console.log('Backup do banco de dados Produto excluído com sucesso!');
  //   } else {
  //     console.log('Nenhum backup do banco de dados Produto encontrado.');
  //   }
  // } catch (error) {
  //   console.error('Erro ao excluir o backup do banco de dados Produto:', error);
  // }
}

export async function shareBackup() {
  try {
    const backupInfo = await FileSystem.getInfoAsync(backupPath);
    if (backupInfo.exists) {
      await Sharing.shareAsync(backupPath);
      console.log('Backup compartilhado com sucesso!');
    } else {
      console.log('Nenhum backup encontrado.');
    }
  } catch (error) {
    console.error('Erro ao compartilhar o backup:', error);
  }
}

export async function importBackup() {
  try {
    // Abre o seletor de documentos para o usuário escolher o arquivo de backup
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // Permite selecionar qualquer tipo de arquivo
      copyToCacheDirectory: false,
    });

    if (!result.canceled) {
      
      const selectedAsset = result.assets[0];
     console.log(selectedAsset.uri)

      // Verifica se o arquivo selecionado tem a extensão .db
      if (selectedAsset.name.endsWith('.db')) {
        const { uri, name } = selectedAsset;
        const backupDir = `${FileSystem.documentDirectory}Backup`;
        const destPath = `${backupDir}/${name}`;

        // Certifica-se de que o diretório de backup existe
        const dirInfo = await FileSystem.getInfoAsync(backupDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(backupDir);
        }

        // Copia o arquivo selecionado para o local de backup da aplicação
        await FileSystem.copyAsync({
          from: uri,
          to: destPath,
        });

        // Restaurando o banco de dados
        await FileSystem.copyAsync({
          from: destPath,
          to: `${FileSystem.documentDirectory}SQLite/notas.db`,
        });

        console.log('Banco de dados restaurado com sucesso!');
        router.navigate('/')
      } else {
        console.log('Por favor, selecione um arquivo .db.');
        Alert.alert('Extensão não Válida', 'Selecione um arquivo com a extensão .db')
      }
    } else {
      console.log('Nenhum arquivo foi selecionado.');
    }
  } catch (error) {
    console.error('Erro ao importar o backup:', error);
  }
}

