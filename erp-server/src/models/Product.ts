import { query } from '../database/connection';
import { Product } from '../types';
import { v4 as uuid } from 'uuid';

export class ProductModel {
  static async create(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const id = uuid();
    const result = await query(
      `INSERT INTO products (id, name, sku, price, tax_rate)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, data.name, data.sku, data.price, data.tax_rate]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<Product | null> {
    const result = await query(
      `SELECT * FROM products WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findBySKU(sku: string): Promise<Product | null> {
    const result = await query(
      `SELECT * FROM products WHERE sku = $1 AND deleted_at IS NULL`,
      [sku]
    );
    return result.rows[0] || null;
  }

  static async list(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      query(
        `SELECT * FROM products WHERE deleted_at IS NULL AND active = true
         ORDER BY name ASC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query(`SELECT COUNT(*) FROM products WHERE deleted_at IS NULL AND active = true`)
    ]);

    return {
      items: data.rows,
      total: parseInt(total.rows[0].count),
      page,
      limit,
      has_next: offset + limit < parseInt(total.rows[0].count)
    };
  }

  static async update(id: string, data: Partial<Omit<Product, 'id' | 'created_at'>>) {
    const updates = Object.keys(data)
      .filter(k => data[k as keyof typeof data] !== undefined)
      .map((k, i) => `${k} = $${i + 2}`);

    if (updates.length === 0) return this.findById(id);

    const result = await query(
      `UPDATE products SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, ...Object.values(data).filter(v => v !== undefined)]
    );

    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query(
      `UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows.length > 0;
  }
}
