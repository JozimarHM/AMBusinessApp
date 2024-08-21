import { useSQLiteContext } from "expo-sqlite";

export type ProductDatabase = {
  id: number;
  barcode: string;
  name: string;
  price: string;
  quantity: number;
};

export function useProductDatabase() {
  const database = useSQLiteContext();

  async function createProduct(data: Omit<ProductDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO products (barcode,name, price, quantity) VALUES ($barcode,$name, $price, $quantity)"
    );

    try {
      const result = await statement.executeAsync({
        $barcode: data.barcode,
        $name: data.name,
        $price: data.price,
        $quantity: data.quantity,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function getProductById(id: number) {
    try {
      const query = "SELECT * FROM products WHERE id = ?";

      const response = await database.getFirstAsync<ProductDatabase>(query, [
        id,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function getAllProducts() {
    try {
      const query = "SELECT * FROM products";

      const response = await database.getAllAsync<ProductDatabase>(query,);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function getBarcodeProducts(barcode: string) {
    try {
      const query = "SELECT * FROM products WHERE barcode=?";

      const response = await database.getAllAsync<ProductDatabase>(query,  [
        barcode,
      ]);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function updateProduct(data: ProductDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE products SET barcode = $barcode, name=$name , price = $price, quantity = $quantity WHERE id = $id"
    );

    try {
      await statement.executeAsync({
        $id: data.id,
        $barcode: data.barcode,
        $name: data.name,
        $price: data.price,
        $quantity: data.quantity,
      });
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function removeProduct(id: number) {
    try {
      await database.execAsync("DELETE FROM products WHERE id = " + id);
    } catch (error) {
      throw error;
    }
  }

  return { createProduct, getProductById, getAllProducts,getBarcodeProducts, updateProduct, removeProduct };
}
