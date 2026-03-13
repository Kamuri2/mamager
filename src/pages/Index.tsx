import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PEDIDOS } from '@/graphql/operations';
import { XPWindow } from '@/components/XPWindow';
import { PedidoTable } from '@/components/PedidoTable';
import { PedidoForm } from '@/components/PedidoForm';
import { WaterSpinner } from '@/components/WaterSpinner';
import { XPToastContainer } from '@/components/XPToast';
import blissBg from '@/assets/bliss-bg.jpg';

type ViewMode = 'list' | 'form';

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

const Index = () => {
  const [view, setView] = useState<ViewMode>('list');
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const { data, loading, error } = useQuery<{ pedidos: Pedido[] }>(GET_PEDIDOS);

  const handleEdit = (pedido: Pedido) => {
    setEditingPedido(pedido);
    setView('form');
  };

  const handleNewPedido = () => {
    setEditingPedido(null);
    setView('form');
  };

  const handleFormDone = () => {
    setEditingPedido(null);
    setView('list');
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4 md:p-8"
      style={{ backgroundImage: `url(${blissBg})` }}
    >
      <XPToastContainer />

      {/* Taskbar-style tabs */}
      <div className="flex gap-1 mb-4 ml-1">
        <button
          className={`xp-btn ${view === 'list' ? 'xp-btn-blue' : 'xp-btn-green'} px-5 py-2`}
          onClick={() => setView('list')}
        >
          📋 LISTADO DE PEDIDOS
        </button>
        <button
          className={`xp-btn ${view === 'form' && !editingPedido ? 'xp-btn-blue' : 'xp-btn-green'} px-5 py-2`}
          onClick={handleNewPedido}
        >
          ➕ NUEVO PEDIDO
        </button>
      </div>

      {/* Main Window */}
      {view === 'list' && (
        <XPWindow title="📦 Pedidos de Comida — Listado">
          {loading ? (
            <WaterSpinner />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm font-semibold" style={{ color: 'hsl(0, 70%, 50%)' }}>
                ⚠️ Error de conexión con el servidor GraphQL
              </p>
              <p className="text-xs mt-2" style={{ color: 'hsl(0, 50%, 40%)' }}>
                {error.message}
              </p>
              <p className="text-xs mt-1 text-muted-foreground">
                Asegúrate de que el backend esté corriendo en http://localhost:3000/graphql
              </p>
            </div>
          ) : (
            <PedidoTable pedidos={data?.pedidos ?? []} onEdit={handleEdit} />
          )}
        </XPWindow>
      )}

      {view === 'form' && (
        <XPWindow
          title={editingPedido ? `✏️ Editando Pedido #${editingPedido.id}` : '➕ Nuevo Pedido'}
          onClose={handleFormDone}
        >
          <PedidoForm editingPedido={editingPedido} onDone={handleFormDone} />
        </XPWindow>
      )}
    </div>
  );
};

export default Index;
