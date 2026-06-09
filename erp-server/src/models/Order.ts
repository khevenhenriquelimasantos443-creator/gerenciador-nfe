import { transaction, query } from '../database/connection';
import { Order, OrderItem, OrderStatus } from '../../shared/types';
import { v4 as uuid } from 'uuid';

export class OrderModel {
  static async create(data: {
    customer_id: string;
    items: OrderItem[];
    notes?: string;
  }): Promise<Order> {
    return transaction(async (client) => {
      const orderId = uuid();

      // Calcular totais
      let total = 0;
      let tax_total = 0;

      // Buscar taxas dos produtos
      const productIds = data.items.map(i => i.product_id);
      const productsResult = await client.query(
        `SELECT id, tax_rate FROM products WHERE id = ANY($1)`,
        [productIds]
      );

      const taxMap = new Map(productsResult.rows.map(r => [r.id, r.tax_rate]));

      // Validar cálculos
      for (const item of data.items) {
        const tax_rate = taxMap.get(item.product_id) || 0;
        const itemTotal = item.quantity * item.unit_price;
        const itemTax = itemTotal * (tax_rate / 100);

        total += itemTotal;
        tax_total += itemTax;
      }

      // Inserir pedido
      const orderResult = await client.query(
        `INSERT INTO orders (id, customer_id, status, total, tax_total, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [orderId, data.customer_id, OrderStatus.DRAFT, total, tax_total, data.notes]
      );

      // Inserir itens
      for (const item of data.items) {
        await client.query(
          `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [uuid(), orderId, item.product_id, item.quantity, item.unit_price, item.subtotal]
        );
      }

      return orderResult.rows[0];
    });
  }

  static async findById(id: string): Promise<Order | null> {
    const [orderResult, itemsResult] = await Promise.all([
      query(`SELECT * FROM orders WHERE id = $1`, [id]),
      query(`SELECT * FROM order_items WHERE order_id = $1`, [id])
    ]);

    if (orderResult.rows.length === 0) return null;

    return {
      ...orderResult.rows[0],
      items: itemsResult.rows
    };
  }

  static async list(filters?: {
    customer_id?: string;
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params: any[] = [];

    if (filters?.customer_id) {
      whereClause += 'customer_id = $' + (params.length + 1);
      params.push(filters.customer_id);
    }

    if (filters?.status) {
      if (whereClause) whereClause += ' AND ';
      whereClause += 'status = $' + (params.length + 1);
      params.push(filters.status);
    }

    const sql = `
      SELECT o.*, COUNT(*) OVER () as total_count
      FROM orders o
      ${whereClause ? 'WHERE ' + whereClause : ''}
      ORDER BY o.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const result = await query(sql, [...params, limit, offset]);

    return {
      items: result.rows,
      total: result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0,
      page,
      limit,
      has_next: offset + limit < (result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0)
    };
  }

  static async updateStatus(id: string, status: OrderStatus, version: number): Promise<Order | null> {
    // Optimistic locking: só atualiza se a versão corresponder
    const result = await query(
      `UPDATE orders SET status = $1, version = version + 1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND version = $3
       RETURNING *`,
      [status, id, version]
    );

    return result.rows[0] || null;
  }

  static async addItems(orderId: string, items: OrderItem[]): Promise<void> {
    return transaction(async (client) => {
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [uuid(), orderId, item.product_id, item.quantity, item.unit_price, item.subtotal]
        );
      }

      // Recalcular totais do pedido
      const itemsResult = await client.query(
        `SELECT SUM(subtotal) as total_subtotal FROM order_items WHERE order_id = $1`,
        [orderId]
      );

      const total = itemsResult.rows[0]?.total_subtotal || 0;

      await client.query(
        `UPDATE orders SET total = $1, version = version + 1 WHERE id = $2`,
        [total, orderId]
      );
    });
  }
}
