import { query } from '../database/connection';
import { Customer } from '../types';
import { v4 as uuid } from 'uuid';

export class CustomerModel {
  static async create(data: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    const id = uuid();
    const result = await query(
      `INSERT INTO customers (id, name, cnpj_cpf, email, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, data.name, data.cnpj_cpf, data.email, data.phone, data.address]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<Customer | null> {
    const result = await query(
      `SELECT * FROM customers WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByCNPJ(cnpj_cpf: string): Promise<Customer | null> {
    const result = await query(
      `SELECT * FROM customers WHERE cnpj_cpf = $1 AND deleted_at IS NULL`,
      [cnpj_cpf]
    );
    return result.rows[0] || null;
  }

  static async list(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    const [data, total] = await Promise.all([
      query(
        `SELECT * FROM customers WHERE deleted_at IS NULL
         ORDER BY name ASC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      query(`SELECT COUNT(*) FROM customers WHERE deleted_at IS NULL`)
    ]);

    return {
      items: data.rows,
      total: parseInt(total.rows[0].count),
      page,
      limit,
      has_next: offset + limit < parseInt(total.rows[0].count)
    };
  }

  static async update(id: string, data: Partial<Omit<Customer, 'id' | 'created_at'>>) {
    const updates = Object.keys(data)
      .filter(k => data[k as keyof typeof data] !== undefined)
      .map((k, i) => `${k} = $${i + 2}`);

    if (updates.length === 0) return this.findById(id);

    const result = await query(
      `UPDATE customers SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [id, ...Object.values(data).filter(v => v !== undefined)]
    );

    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query(
      `UPDATE customers SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows.length > 0;
  }
}
