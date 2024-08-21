import { useSQLiteContext } from "expo-sqlite"


export type NotasDatabase = {
  id: number
  title: string
  tel: string
  nota: string
  valor: string
  pago: string
  date: string
  pinned: number
  cor: string
  valorParcial: string
  valorRestante: string,
  corTexto: string,
  parcela: number
}


export function useNotasDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<NotasDatabase, "id">) {
    const statement = await database.prepareAsync(
      "INSERT INTO notas (title,tel,nota,valor,pago, date,pinned,cor, valorParcial, valorRestante, corTexto, parcela) VALUES ($title,  $tel, $nota, $valor, $pago, $date, $pinned, $cor, $valorParcial, $valorRestante, $corTexto, $parcela)"
    )

    try {
      const result = await statement.executeAsync({
        $title: data.title,
        $tel: data.tel,
        $nota: data.nota,
        $valor: data.valor,
        $pago: data.pago,
        $date: data.date,
        $pinned: data.pinned,
        $cor: data.cor,
        $valorParcial: data.valorParcial,
        $valorRestante: data.valorRestante,
        $corTexto: data.corTexto,
        $parcela: data.parcela
      })

      const insertedRowId = result.lastInsertRowId.toLocaleString()

      return { insertedRowId }
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function searchByName(title: string) {
    try {
      const query = "SELECT * FROM notas WHERE title LIKE ?"

      const response = await database.getAllAsync<NotasDatabase>(
        query,
        `%${title}%`
      )

      return response
    } catch (error) {
      throw error
    }
  }

  async function update(data: NotasDatabase) {
    const statement = await database.prepareAsync(
      "UPDATE notas SET title = $title, tel = $tel, nota = $nota, valor = $valor, pago = $pago, date = $date, pinned = $pinned, cor = $cor, valorParcial = $valorParcial, valorRestante = $valorRestante, corTexto = $corTexto,  parcela = $parcela WHERE id = $id"
    )

    try {
      await statement.executeAsync({
        $id: data.id,
        $title: data.title,
        $tel: data.tel,
        $nota: data.nota,
        $valor: data.valor,
        $pago: data.pago,
        $date: data.date,
        $pinned: data.pinned,
        $cor: data.cor,
        $valorParcial: data.valorParcial,
        $valorRestante: data.valorRestante,
        $corTexto: data.corTexto,
        $parcela: data.parcela
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function updatePin(data: Omit<NotasDatabase, "title" | "tel" | "nota" | "valor" | "pago" | "date" | "cor" | "valorParcial" | "valorRestante" | "corTexto" | "parcela">) {
    const statement = await database.prepareAsync(
      "UPDATE notas SET pinned = $pinned WHERE id = $id"
    )

    try {
      await statement.executeAsync({
        $id: data.id,
        $pinned: data.pinned
      })
    } catch (error) {
      throw error
    } finally {
      await statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    try {
      await database.execAsync("DELETE FROM notas WHERE id = " + id)
    } catch (error) {
      throw error
    }
  }

  async function show(id: number) {
    try {
      const query = "SELECT * FROM notas WHERE id = ?"

      const response = await database.getFirstAsync<NotasDatabase>(query, [
        id,
      ])

      return response
    } catch (error) {
      throw error
    }
  }

  return { create, searchByName, update, updatePin, remove, show }
}
