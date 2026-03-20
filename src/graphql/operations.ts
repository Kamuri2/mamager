import { gql } from '@apollo/client';

// 1. QUERY PARA LA TABLA (Trae los nombres de los catálogos)
export const GET_PEDIDOS = gql`
  query ObtenerPedidos {
    pedidos {
      id
      nombre_cliente
      telefono
      direccion_entrega
      codigo_postal
      producto
      cantidad
      precio
      propina
      instrucciones_entrega
      # Campos de relación (IDs)
      ciudadId
      restauranteId
      categoriaId
      metodoPagoId
      # Objetos de relación para mostrar el texto en la tabla
      ciudad {
        nombre
      }
      restaurante {
        nombre
      }
      categoria {
        nombre
      }
      metodoPago {
        nombre
      }
    }
  }
`;

export const CREATE_PEDIDO = gql`
  mutation RegistrarPedido($input: CreatePedidoInput!) {
    createPedido(input: $input) {  # <--- AQUÍ: Debe decir 'input:', NO 'data:'
      id
      nombre_cliente
    }
  }
`;

export const UPDATE_PEDIDO = gql`
  mutation ActualizarPedido($id: Int!, $input: UpdatePedidoInput!) {
    updatePedido(id: $id, input: $input) { # <--- AQUÍ TAMBIÉN: 'input:', NO 'data:'
      id
      nombre_cliente
    }
  }
`;// 3. MUTACIÓN PARA ACTUALIZAR


// 4. QUERY PARA LOS SELECTS DEL FORMULARIO
export const GET_FORM_CATALOGS = gql`
  query ObtenerCatalogosFormulario {
    ciudades: catalogCiudads {
      id
      nombre
    }
    restaurantes: catalogRestaurantes {
      id
      nombre
    }
    categorias: catalogCategorias {
      id
      nombre
    }
    metodosPago: catalogMetodoPagos {
      id
      nombre
    }
  }
`;