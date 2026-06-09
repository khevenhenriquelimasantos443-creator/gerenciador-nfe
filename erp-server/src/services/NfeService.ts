import { Order, Invoice, OrderStatus } from '../../shared/types';
import { OrderModel } from '../models/Order';
import { CustomerModel } from '../models/Customer';
import { query } from '../database/connection';
import { v4 as uuid } from 'uuid';
import * as xml from 'xmlbuilder';

export class NfeService {
  private static readonly COMPANY_CNPJ = process.env.COMPANY_CNPJ || '00000000000000';
  private static readonly COMPANY_NAME = process.env.COMPANY_NAME || 'Empresa';

  static async generateNFe(orderId: string): Promise<Invoice> {
    const order = await OrderModel.findById(orderId);
    if (!order) throw new Error('Pedido não encontrado');

    const customer = await CustomerModel.findById(order.customer_id);
    if (!customer) throw new Error('Cliente não encontrado');

    // Gerar número NF-e (sequencial)
    const nfeNumberResult = await query(`SELECT nextval('nfe_sequence') as number`);
    const nfe_number = String(nfeNumberResult.rows[0].number).padStart(9, '0');
    const nfe_series = '1';

    // Gerar XML (estrutura básica, sem assinatura digital por enquanto)
    const xmlContent = this.buildNFeXML({
      nfe_number,
      nfe_series,
      order,
      customer
    });

    // Salvar no banco
    const result = await query(
      `INSERT INTO invoices (id, order_id, nfe_number, nfe_series, xml_content, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [uuid(), orderId, nfe_number, nfe_series, xmlContent, 'draft']
    );

    // Atualizar status do pedido
    await OrderModel.updateStatus(orderId, OrderStatus.INVOICED, order.version);

    return result.rows[0];
  }

  private static buildNFeXML(data: {
    nfe_number: string;
    nfe_series: string;
    order: Order;
    customer: any;
  }): string {
    const root = xml.create('NFe', { version: '1.0', encoding: 'UTF-8' });
    const infNFe = root.ele('infNFe', {
      Id: `NFe${data.nfe_number}`,
      versao: '4.00'
    });

    // Identificação
    const ide = infNFe.ele('ide');
    ide.ele('cUF', '35'); // São Paulo
    ide.ele('cNF', data.nfe_number);
    ide.ele('assinaturaQRCode'); // Placeholder
    ide.ele('CNPJ', this.COMPANY_CNPJ);
    ide.ele('xNome', this.COMPANY_NAME);
    ide.ele('natOp', 'VENDA');
    ide.ele('mod', '55');
    ide.ele('serie', data.nfe_series);
    ide.ele('nNF', data.nfe_number);
    ide.ele('dhEmi', new Date().toISOString().split('.')[0]);
    ide.ele('dhSaiEnt', new Date().toISOString().split('.')[0]);
    ide.ele('tpNF', '1'); // Saída
    ide.ele('idDest', '1'); // Operação interna
    ide.ele('cMunFG', '3550308'); // São Paulo
    ide.ele('TpImp', '1'); // Retrato
    ide.ele('TpEmis', '1'); // Normal
    ide.ele('cDV', '0');
    ide.ele('TpAmb', process.env.SEFAZ_ENV === 'production' ? '2' : '1'); // 1=Teste, 2=Produção
    ide.ele('finNFe', '1'); // NFe normal
    ide.ele('indFinal', 'N');
    ide.ele('indPres', '1'); // Presencial
    ide.ele('procEmi', '0'); // Emissão normal
    ide.ele('verProc', '1.0.0');

    // Emitente
    const emit = infNFe.ele('emit');
    emit.ele('CNPJ', this.COMPANY_CNPJ);
    emit.ele('xNome', this.COMPANY_NAME);
    emit.ele('xFant', this.COMPANY_NAME);
    const enderEmit = emit.ele('enderEmit');
    enderEmit.ele('xLgr', 'Rua Exemplo');
    enderEmit.ele('nro', '123');
    enderEmit.ele('cMun', '3550308');
    enderEmit.ele('UF', 'SP');
    enderEmit.ele('CEP', '01310100');
    enderEmit.ele('cPais', '1058');
    enderEmit.ele('xPais', 'Brasil');
    emit.ele('IE', '0000000000000');
    emit.ele('CRT', '1'); // Simples Nacional

    // Destinatário
    const dest = infNFe.ele('dest');
    dest.ele('CNPJ', data.customer.cnpj_cpf);
    dest.ele('xNome', data.customer.name);
    const enderDest = dest.ele('enderDest');
    enderDest.ele('xLgr', data.customer.address || 'Rua não informada');
    enderDest.ele('nro', '1');
    enderDest.ele('cMun', '3550308');
    enderDest.ele('UF', 'SP');
    enderDest.ele('CEP', '01310100');
    enderDest.ele('cPais', '1058');
    enderDest.ele('xPais', 'Brasil');

    // Detalhes dos produtos
    const det = infNFe.ele('det', { nItem: '1' });
    const prod = det.ele('prod');
    prod.ele('CProd', 'PRODUTO1');
    prod.ele('cEAN', 'SEM GTIN');
    prod.ele('xProd', 'Descrição do Produto');
    prod.ele('NCM', '12345678');
    prod.ele('CFOP', '5102');
    prod.ele('uCom', 'UN');
    prod.ele('qCom', String(data.order.items[0]?.quantity || 1));
    prod.ele('vUnCom', String(data.order.items[0]?.unit_price || 0));
    prod.ele('vProd', String(data.order.total));
    prod.ele('vDesc', '0');
    prod.ele('vOutro', '0');
    prod.ele('indTot', '1');

    // Imposto (Simples Nacional)
    const imposto = det.ele('imposto');
    const icmsSN = imposto.ele('ICMSSN');
    icmsSN.ele('orig', '0');
    icmsSN.ele('CSOSN', '102'); // Sem débito/crédito

    // Total
    const total = infNFe.ele('total');
    const ICMSTot = total.ele('ICMSTot');
    ICMSTot.ele('vBC', '0.00');
    ICMSTot.ele('vICMS', '0.00');
    ICMSTot.ele('vICMSDeson', '0.00');
    ICMSTot.ele('vBCST', '0.00');
    ICMSTot.ele('vST', '0.00');
    ICMSTot.ele('vProd', String(data.order.total));
    ICMSTot.ele('vFrete', '0.00');
    ICMSTot.ele('vSeg', '0.00');
    ICMSTot.ele('vDesc', '0.00');
    ICMSTot.ele('vII', '0.00');
    ICMSTot.ele('vIPI', '0.00');
    ICMSTot.ele('vPIS', '0.00');
    ICMSTot.ele('vCOFINS', '0.00');
    ICMSTot.ele('vOutro', '0.00');
    ICMSTot.ele('vNF', String(data.order.total + data.order.tax_total));

    return root.toString({ pretty: true });
  }

  static async submitToSEFAZ(invoiceId: string): Promise<{ status: string; protocol?: string }> {
    // TODO: Implementar comunicação com SEFAZ (produção)
    // Por enquanto, apenas marcar como "sent"
    await query(
      `UPDATE invoices SET status = 'sent', sefaz_status = 'pending' WHERE id = $1`,
      [invoiceId]
    );

    return { status: 'queued' };
  }
}
