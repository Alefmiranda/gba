import type { CollectionConfig } from 'payload'
import {
  MODELO_OPTIONS,
  TAMANHO_OPTIONS,
  modeloLabel,
  tamanhosDoModelo,
} from './camisetasCatalog'

export const PedidosCamiseta: CollectionConfig = {
  slug: 'pedidos-camiseta',
  labels: {
    singular: 'Pedido de Camiseta',
    plural: 'Pedidos de Camiseta',
  },
  admin: {
    useAsTitle: 'nome',
    defaultColumns: ['nome', 'modelo', 'tamanho', 'quantidade', 'createdAt'],
    group: 'Pedidos',
    description:
      'Pedidos enviados pelos membros pela página /pedidos-camisetas. Use "Baixar lista (CSV)" pra mandar pro fornecedor.',
    components: {
      // Botão de download da lista completa em CSV, acima da tabela.
      beforeListTable: ['/components/admin/ExportPedidosButton'],
    },
  },
  access: {
    // Qualquer pessoa com o link do formulário pode CRIAR um pedido.
    create: () => true,
    // Ler / editar / apagar: só quem está logado no admin (default do Payload).
  },
  fields: [
    {
      name: 'nome',
      type: 'text',
      label: 'Nome completo',
      required: true,
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp',
      required: true,
    },
    {
      name: 'modelo',
      type: 'select',
      label: 'Modelo',
      required: true,
      options: MODELO_OPTIONS,
    },
    {
      name: 'tamanho',
      type: 'select',
      label: 'Tamanho',
      required: true,
      options: TAMANHO_OPTIONS,
      validate: (value: unknown, { siblingData }: { siblingData?: { modelo?: string } }) => {
        if (!value) return 'Selecione um tamanho.'
        const modelo = siblingData?.modelo
        const validos = tamanhosDoModelo(modelo)
        if (validos.length && !validos.includes(String(value))) {
          return `Tamanho "${value}" não existe para ${modeloLabel(modelo)}.`
        }
        return true
      },
    },
    {
      name: 'quantidade',
      type: 'number',
      label: 'Quantidade',
      required: true,
      defaultValue: 1,
      min: 1,
    },
    {
      name: 'observacoes',
      type: 'textarea',
      label: 'Observações',
    },
  ],
}
