import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PEDIDO, UPDATE_PEDIDO, GET_PEDIDOS } from '@/graphql/operations';
import { showXPToast } from './XPToast';

interface Pedido {
  id?: number;
  nombre_cliente: string;
  telefono: string;
  direccion_entrega: string;
  ciudad: string;
  codigo_postal: number | string;
  restaurante: string;
  producto: string;
  categoria_comida: string;
  cantidad: number | string;
  precio: number | string;
  metodo_pago: string;
  propina: number | string;
  instrucciones_entrega: string;
}

const emptyPedido: Pedido = {
  nombre_cliente: '',
  telefono: '',
  direccion_entrega: '',
  ciudad: '',
  codigo_postal: '',
  restaurante: '',
  producto: '',
  categoria_comida: '',
  cantidad: '',
  precio: '',
  metodo_pago: '',
  propina: '',
  instrucciones_entrega: '',
};

const fields: { key: keyof Omit<Pedido, 'id'>; label: string; type: string }[] = [
  { key: 'nombre_cliente', label: 'Nombre del Cliente', type: 'text' },
  { key: 'telefono', label: 'Teléfono', type: 'text' },
  { key: 'direccion_entrega', label: 'Dirección de Entrega', type: 'text' },
  { key: 'ciudad', label: 'Ciudad', type: 'text' },
  { key: 'codigo_postal', label: 'Código Postal', type: 'number' },
  { key: 'restaurante', label: 'Restaurante', type: 'text' },
  { key: 'producto', label: 'Producto', type: 'text' },
  { key: 'categoria_comida', label: 'Categoría de Comida', type: 'text' },
  { key: 'cantidad', label: 'Cantidad', type: 'number' },
  { key: 'precio', label: 'Precio', type: 'number' },
  { key: 'metodo_pago', label: 'Método de Pago', type: 'text' },
  { key: 'propina', label: 'Propina', type: 'number' },
  { key: 'instrucciones_entrega', label: 'Instrucciones de Entrega', type: 'text' },
];

interface PedidoFormProps {
  editingPedido: (Pedido & { id: number }) | null;
  onDone: () => void;
}

export function PedidoForm({ editingPedido, onDone }: PedidoFormProps) {
  const [form, setForm] = useState<Pedido>(emptyPedido);
  const isEditing = !!editingPedido;

  useEffect(() => {
    if (editingPedido) {
      setForm({ ...editingPedido });
    } else {
      setForm(emptyPedido);
    }
  }, [editingPedido]);

  const [createPedido, { loading: creating }] = useMutation(CREATE_PEDIDO, {
    refetchQueries: [{ query: GET_PEDIDOS }],
    onCompleted: () => {
      showXPToast('✅ Pedido creado exitosamente');
      setForm(emptyPedido);
      onDone();
    },
    onError: (err) => showXPToast(`❌ Error: ${err.message}`),
  });

  const [updatePedido, { loading: updating }] = useMutation(UPDATE_PEDIDO, {
    refetchQueries: [{ query: GET_PEDIDOS }],
    onCompleted: () => {
      showXPToast('✏️ Pedido actualizado exitosamente');
      setForm(emptyPedido);
      onDone();
    },
    onError: (err) => showXPToast(`❌ Error: ${err.message}`),
  });

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      nombre_cliente: form.nombre_cliente,
      telefono: form.telefono,
      direccion_entrega: form.direccion_entrega,
      ciudad: form.ciudad,
      codigo_postal: parseInt(String(form.codigo_postal), 10),
      restaurante: form.restaurante,
      producto: form.producto,
      categoria_comida: form.categoria_comida,
      cantidad: parseInt(String(form.cantidad), 10),
      precio: parseFloat(String(form.precio)),
      metodo_pago: form.metodo_pago,
      propina: parseFloat(String(form.propina)),
      instrucciones_entrega: form.instrucciones_entrega,
    };

    if (isEditing && editingPedido) {
      updatePedido({ variables: { id: editingPedido.id, input } });
    } else {
      createPedido({ variables: { input } });
    }
  };

  const loading = creating || updating;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-xs font-semibold" style={{ color: 'hsl(220, 20%, 30%)' }}>
              {f.label}
            </label>
            <input
              className="xp-input w-full"
              type={f.type}
              step={f.type === 'number' ? 'any' : undefined}
              value={String(form[f.key] ?? '')}
              onChange={(e) => handleChange(f.key, e.target.value)}
              required
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          className={`xp-btn ${isEditing ? 'xp-btn-orange' : 'xp-btn-green'} px-6 py-2`}
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEditing ? '💾 ACTUALIZAR' : '➕ CREAR PEDIDO'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="xp-btn xp-btn-blue px-6 py-2"
            onClick={() => { setForm(emptyPedido); onDone(); }}
          >
            CANCELAR
          </button>
        )}
      </div>
    </form>
  );
}
