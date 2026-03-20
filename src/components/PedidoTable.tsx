// src/components/PedidoTable.tsx
import { Edit2 } from 'lucide-react';

interface Pedido {
  id: number;
  nombre_cliente: string;
  telefono: string;
  direccion_entrega: string;
  codigo_postal: number;
  producto: string;
  cantidad: number;
  precio: number;
  propina: number;
  // Relaciones anidadas de GraphQL
  ciudad?: { nombre: string };
  restaurante?: { nombre: string };
  categoria?: { nombre: string };
  metodoPago?: { nombre: string };
}

interface PedidoTableProps {
  pedidos: Pedido[];
  onEdit: (pedido: Pedido) => void;
}

export function PedidoTable({ pedidos, onEdit }: PedidoTableProps) {
  
  if (pedidos.length === 0) {
    return (
      <div className="bg-white border border-neutral-300 p-8 text-center shadow-inner">
        <p className="text-sm text-neutral-500 italic">No hay pedidos registrados en el sistema de Fidel...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-400 bg-white shadow-inner">
      <table className="w-full text-left border-collapse min-w-[1100px]">
        <thead>
          <tr className="bg-[#0055E5] text-white text-[11px] uppercase tracking-wider">
            <th className="px-3 py-2 border-r border-blue-400 font-bold">ID</th>
            <th className="px-3 py-2 border-r border-blue-400 font-bold">Cliente</th>
            <th className="px-3 py-2 border-r border-blue-400 font-bold">Ciudad</th>
            <th className="px-3 py-2 border-r border-blue-400 font-bold">Restaurante</th>
            <th className="px-3 py-2 border-r border-blue-400 font-bold">Categoría</th>
            <th className="px-3 py-2 border-r border-blue-400 font-bold">Producto</th>
            <th className="px-3 py-2 border-r border-blue-400 font-bold">Cant.</th>
            <th className="px-3 py-2 border-r border-blue-400 font-bold">Total</th>
            <th className="px-3 py-2 border-r border-blue-400 font-bold">Pago</th>
            <th className="px-3 py-2 font-bold text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-[12px] text-neutral-800">
          {pedidos.map((p) => {
            // Calculamos el total de forma segura
            const total = (Number(p.precio) * Number(p.cantidad)) + Number(p.propina || 0);
            
            return (
              <tr key={p.id} className="border-b border-neutral-200 hover:bg-[#FFFFE1] transition-colors">
                <td className="px-3 py-2 border-r border-neutral-200 font-mono text-[#000080]">#{p.id}</td>
                <td className="px-3 py-2 border-r border-neutral-200 font-bold">{p.nombre_cliente}</td>
                
                {/* ✅ Relaciones con fallback para que no salga vacío */}
                <td className="px-3 py-2 border-r border-neutral-200">{p.ciudad?.nombre || 'N/A'}</td>
                <td className="px-3 py-2 border-r border-neutral-200 text-blue-800">{p.restaurante?.nombre || 'N/A'}</td>
                <td className="px-3 py-2 border-r border-neutral-200 font-semibold text-orange-700">
                  {p.categoria?.nombre || 'N/A'}
                </td>
                
                <td className="px-3 py-2 border-r border-neutral-200">{p.producto}</td>
                <td className="px-3 py-2 border-r border-neutral-200 text-center">{p.cantidad}</td>
                
                <td className="px-3 py-2 border-r border-neutral-200 font-bold text-green-700">
                  ${total.toFixed(2)}
                </td>
                
                <td className="px-3 py-2 border-r border-neutral-200">
                  <span className="bg-neutral-100 px-1.5 py-0.5 border border-neutral-300 rounded-sm text-[10px]">
                    {p.metodoPago?.nombre || 'Efectivo'}
                  </span>
                </td>

                <td className="px-3 py-1 text-center">
                  <button
                    onClick={() => onEdit(p)}
                    className="xp-btn xp-btn-green px-3 py-1 text-[10px] flex items-center gap-1 mx-auto"
                  >
                    <Edit2 size={10} /> EDITAR
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Footer estilo Barra de Estado */}
      <div className="bg-[#E0DFE3] border-t border-neutral-400 px-3 py-1 flex justify-between items-center text-[10px] text-neutral-600">
        <span>Total de pedidos: {pedidos.length}</span>
        <span className="italic font-bold">Comida Pedidos</span>
      </div>
    </div>
  );
}