import { gql } from '@apollo/client';

export const GET_PEDIDOS = gql`
  query GetPedidos {
    pedidos {
      id
      nombre_cliente
      telefono
      direccion_entrega
      ciudad
      codigo_postal
      restaurante
      producto
      categoria_comida
      cantidad
      precio
      metodo_pago
      propina
      instrucciones_entrega
    }
  }
`;

export const CREATE_PEDIDO = gql`
  mutation CreatePedido($input: CreatePedidoInput!) {
    createPedido(createPedidoInput: $input) {
      id
    }
  }
`;

export const UPDATE_PEDIDO = gql`
  mutation UpdatePedido($id: Int!, $input: UpdatePedidoInput!) {
    updatePedido(id: $id, updatePedidoInput: $input) {
      id
    }
  }
`;

export const REMOVE_PEDIDO = gql`
  mutation RemovePedido($id: Int!) {
    removePedido(id: $id) {
      id
    }
  }
`;
