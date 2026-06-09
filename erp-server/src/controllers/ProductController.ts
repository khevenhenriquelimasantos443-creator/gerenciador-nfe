import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';
import { ApiResponse } from '../types';

export class ProductController {
  static async create(req: Request, res: Response) {
    try {
      const { name, sku, price, tax_rate } = req.body;

      if (!name || !sku || price === undefined) {
        return res.status(400).json({
          success: false,
          error: 'name, sku e price são obrigatórios',
          timestamp: new Date()
        } as ApiResponse);
      }

      // Verificar se SKU já existe
      const existing = await ProductModel.findBySKU(sku);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'SKU já cadastrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      const product = await ProductModel.create({
        name,
        sku,
        price: parseFloat(price),
        tax_rate: tax_rate ? parseFloat(tax_rate) : 0
      });

      return res.status(201).json({
        success: true,
        data: product,
        timestamp: new Date()
      } as ApiResponse);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message,
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: product,
        timestamp: new Date()
      } as ApiResponse);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message,
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await ProductModel.list(page, limit);

      return res.json({
        success: true,
        data: result,
        timestamp: new Date()
      } as ApiResponse);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message,
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await ProductModel.update(id, updates);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: product,
        timestamp: new Date()
      } as ApiResponse);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message,
        timestamp: new Date()
      } as ApiResponse);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await ProductModel.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: { message: 'Produto deletado com sucesso' },
        timestamp: new Date()
      } as ApiResponse);
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message,
        timestamp: new Date()
      } as ApiResponse);
    }
  }
}
