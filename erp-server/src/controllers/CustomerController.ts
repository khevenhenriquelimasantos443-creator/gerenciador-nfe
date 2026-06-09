import { Request, Response } from 'express';
import { CustomerModel } from '../models/Customer';
import { ApiResponse } from '../../shared/types';

export class CustomerController {
  static async create(req: Request, res: Response) {
    try {
      const { name, cnpj_cpf, email, phone, address } = req.body;

      if (!name || !cnpj_cpf) {
        return res.status(400).json({
          success: false,
          error: 'name e cnpj_cpf são obrigatórios',
          timestamp: new Date()
        } as ApiResponse);
      }

      // Verificar se CNPJ já existe
      const existing = await CustomerModel.findByCNPJ(cnpj_cpf);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'CNPJ/CPF já cadastrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      const customer = await CustomerModel.create({
        name,
        cnpj_cpf,
        email,
        phone,
        address
      });

      return res.status(201).json({
        success: true,
        data: customer,
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
      const customer = await CustomerModel.findById(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: customer,
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

      const result = await CustomerModel.list(page, limit);

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

      const customer = await CustomerModel.update(id, updates);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: customer,
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
      const success = await CustomerModel.delete(id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Cliente não encontrado',
          timestamp: new Date()
        } as ApiResponse);
      }

      return res.json({
        success: true,
        data: { message: 'Cliente deletado com sucesso' },
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
