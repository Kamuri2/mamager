import { useMutation } from '@apollo/client/react';
import { REMOVE_PEDIDO, GET_PEDIDOS } from '@/graphql/operations';
import { showXPToast } from './XPToast';

interface Pedido {
  id: number;
  nombre_cliente: string;
  telefono: string;
  direccion_entrega: string;
  ciudad: string;
  codigo_postal: number;
  restaurante: string;
  producto: string;
  categoria_comida: string;
  cantidad: number;
  precio: number;
  metodo_pago: string;
  propina: number;
  instrucciones_entrega: string;
}

interface PedidoTableProps {
  pedidos: Pedido[];
  onEdit: (pedido: Pedido) => void;
}

export function PedidoTable({ pedidos, onEdit }: PedidoTableProps) {
  const [removePedido] = useMutation(REMOVE_PEDIDO, {
    refetchQueries: [{ query: GET_PEDIDOS }],
    onCompleted: () => showXPToast('🗑️ Pedido eliminado correctamente'),
    onError: (err) => showXPToast(`❌ Error: ${err.message}`),
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      removePedido({ variables: { id } });
    }
  };

  return (
    <div className="overflow-x-auto xp-scroll" style={{ maxHeight: '60vh' }}>
      <table className="xp-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>CP</th>
            <th>Restaurante</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Pago</th>
            <th>Propina</th>
            <th>Instrucciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre_cliente}</td>
              <td>{p.telefono}</td>
              <td className="max-w-[120px] truncate">{p.direccion_entrega}</td>
              <td>{p.ciudad}</td>
              <td>{p.codigo_postal}</td>
              <td>{p.restaurante}</td>
              <td>{p.producto}</td>
              <td>{p.categoria_comida}</td>
              <td>{p.cantidad}</td>
              <td>${p.precio?.toFixed(2)}</td>
              <td>{p.metodo_pago}</td>
              <td>${p.propina?.toFixed(2)}</td>
              <td className="max-w-[120px] truncate">{p.instrucciones_entrega}</td>
              <td>
                <div className="flex gap-1">
                  <button
                    className="xp-btn xp-btn-blue text-[11px] px-3 py-1"
                    onClick={() => onEdit(p)}
                  >
                    EDIT
                  </button>
                  <button
                    className="xp-btn xp-btn-red text-[11px] px-3 py-1"
                    onClick={() => handleDelete(p.id)}
                  >
                    PURGE
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {pedidos.length === 0 && (
            <tr>
              <td colSpan={15} className="text-center py-8 text-muted-foreground">
                No hay pedidos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
