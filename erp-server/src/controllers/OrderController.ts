import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { CustomerModel } from '../models/Customer';
import { ProductModel } from '../models/Product';
import { NfeService } from '../services/NfeService';
import { OrderStatus, ApiResponse } from '../types';

export class OrderController {
  static async create(req: Request, res: Response) {
    try {
      const { customer_id, items, notes } = req.body;

      // Validações
      if (!customer_id) {
        return res.status(400).json({
          success: false,
          error: 'customer_id é obrigatório',
          timestamp: new Date()
        } as ApiResponse);
      }

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'items deve ser um array não vazio',
          timestamp: new Date()
        } as ApiResponse);
      }

      // Verificar cliente existe
      const customer = await CustomerModel.findById(customer_id);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      // Verificar produtos existem
      for (const item of items) {
        const product = await ProductModel.findById(item.product_id);
        if (!product) {
          return res.status(404).json({
            success: false,
            error: `Produto ${item.product_id} não encontrado`,
            timestamp: new Date()
          } as ApiResponse);
        }
      }

      const order = await OrderModel.create({
        customer_id,
        items,
        notes
      });

      return res.status(201).json({
        success: true,
        data: order,
        timestamp: new Date()
      } as ApiResponse);
    } catch (err: any) {
      console.error('Erro ao criar pedido:', err);
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
      const order = await OrderModel.findById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Pedido não encontrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: order,
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
      const customer_id = req.query.customer_id as string;
      const status = req.query.status as OrderStatus;

      const result = await OrderModel.list({
        customer_id,
        status,
        page,
        limit
      });

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

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, version } = req.body;

      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Status inválido',
          timestamp: new Date()
        } as ApiResponse);
      }

      const order = await OrderModel.updateStatus(id, status, version);

      if (!order) {
        return res.status(409).json({
          success: false,
          error: 'Conflito de versão - pedido foi modificado',
          timestamp: new Date()
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: order,
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

  static async generateInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const invoice = await NfeService.generateNFe(id);

      return res.json({
        success: true,
        data: invoice,
        timestamp: new Date()
      } as ApiResponse);
    } catch (err: any) {
      console.error('Erro ao gerar NF-e:', err);
      return res.status(500).json({
        success: false,
        error: err.message,
        timestamp: new Date()
      } as ApiResponse);
    }
  }
}
