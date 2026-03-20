import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_PEDIDO, UPDATE_PEDIDO, GET_PEDIDOS } from '@/graphql/operations';
import { showXPToast } from './XPToast';

interface Pedido {
  id?: number;
  nombre_cliente: string;
  telefono: string;
  direccion_entrega: string;
  ciudadId: number | string;
  codigo_postal: number | string;
  restauranteId: number | string;
  producto: string;
  categoriaId: number | string;
  cantidad: number | string;
  precio: number | string;
  metodoPagoId: number | string;
  propina: number | string;
  instrucciones_entrega: string;
}

const emptyPedido: Pedido = {
  nombre_cliente: '',
  telefono: '',
  direccion_entrega: '',
  ciudadId: '',
  codigo_postal: '',
  restauranteId: '',
  producto: '',
  categoriaId: '',
  cantidad: '',
  precio: '',
  metodoPagoId: '',
  propina: '',
  instrucciones_entrega: '',
};

interface PedidoFormProps {
  editingPedido: any;
  onDone: () => void;
  catalogos?: {
    ciudades: any[];
    restaurantes: any[];
    categorias: any[];
    metodosPago: any[];
  };
}

export function PedidoForm({ editingPedido, onDone, catalogos }: PedidoFormProps) {
  const [form, setForm] = useState<Pedido>(emptyPedido);
  const isEditing = !!editingPedido;

  useEffect(() => {
    if (editingPedido) {
      setForm({
        ...editingPedido,
        // Forzamos que los IDs sean strings para que el <select> los marque como seleccionados
        ciudadId: String(editingPedido.ciudadId || ''),
        restauranteId: String(editingPedido.restauranteId || ''),
        categoriaId: String(editingPedido.categoriaId || ''),
        metodoPagoId: String(editingPedido.metodoPagoId || ''),
      });
    } else {
      setForm(emptyPedido);
    }
  }, [editingPedido]);

  const [savePedido, { loading }] = useMutation(isEditing ? UPDATE_PEDIDO : CREATE_PEDIDO, {
    refetchQueries: [{ query: GET_PEDIDOS }],
    onCompleted: () => {
      showXPToast(isEditing ? '✏️ Actualizado con éxito' : '✅ Creado con éxito');
      onDone();
    },
    onError: (err) => showXPToast(`❌ Error: ${err.message}`),
  });

  const handleChange = (key: keyof Pedido, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // En PedidoForm.tsx, dentro de handleSubmit

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🧱 Convertimos todo a números (Int/Float)
    const inputPayload = { // Le cambié el nombre a inputPayload para mayor claridad
      nombre_cliente: form.nombre_cliente,
      telefono: form.telefono,
      direccion_entrega: form.direccion_entrega,
      ciudadId: parseInt(String(form.ciudadId)),
      codigo_postal: parseInt(String(form.codigo_postal)),
      restauranteId: parseInt(String(form.restauranteId)),
      producto: form.producto,
      categoriaId: parseInt(String(form.categoriaId)),
      cantidad: parseInt(String(form.cantidad)),
      precio: parseFloat(String(form.precio)),
      metodoPagoId: parseInt(String(form.metodoPagoId)),
      propina: parseFloat(String(form.propina)) || 0,
      instrucciones_entrega: form.instrucciones_entrega,
    };

    
    if (isEditing) {
      // Si editamos, el 'input' debe llevar el 'id' adentro
      (inputPayload as any).id = editingPedido.id; // ¡Toma el ID del pedido que estás editando!
    }
    // --------------------------------------------------

    savePedido({
      // Mandamos las variables correctas
      variables: isEditing 
        ? { id: editingPedido.id, input: inputPayload } // Mandamos ID fuera e inputPayload (con ID dentro)
        : { input: inputPayload } // Para crear, inputPayload va solo
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* SECCIÓN: CLIENTE */}
      <fieldset className="border border-neutral-300 p-4 rounded bg-white/50 shadow-inner">
        <legend className="text-[10px] font-bold text-blue-800 px-2 uppercase">Información de Entrega</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold">CLIENTE:</label>
            <input className="xp-input" value={form.nombre_cliente} onChange={e => handleChange('nombre_cliente', e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold">TELÉFONO:</label>
            <input className="xp-input" value={form.telefono} onChange={e => handleChange('telefono', e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[11px] font-bold">DIRECCIÓN:</label>
            <input className="xp-input" value={form.direccion_entrega} onChange={e => handleChange('direccion_entrega', e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold">📍 CIUDAD:</label>
            <select className="xp-input bg-white" value={form.ciudadId} onChange={e => handleChange('ciudadId', e.target.value)} required>
              <option value="">Seleccione Ciudad...</option>
              {catalogos?.ciudades?.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold">C.P.:</label>
            <input className="xp-input" type="number" value={form.codigo_postal} onChange={e => handleChange('codigo_postal', e.target.value)} required />
          </div>
        </div>
      </fieldset>

      {/* SECCIÓN: RESTAURANTE */}
      <fieldset className="border border-neutral-300 p-4 rounded bg-white/50 shadow-inner">
        <legend className="text-[10px] font-bold text-green-800 px-2 uppercase">Detalles Del Pedido</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold">🏪 RESTAURANTE:</label>
            <select className="xp-input bg-white" value={form.restauranteId} onChange={e => handleChange('restauranteId', e.target.value)} required>
              <option value="">Seleccione...</option>
              {catalogos?.restaurantes?.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold">🍕 CATEGORÍA:</label>
            <select className="xp-input bg-white" value={form.categoriaId} onChange={e => handleChange('categoriaId', e.target.value)} required>
              <option value="">Seleccione...</option>
              {catalogos?.categorias?.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-[11px] font-bold">PRODUCTO:</label>
            <input className="xp-input" value={form.producto} onChange={e => handleChange('producto', e.target.value)} required />
          </div>
          <div className="grid grid-cols-3 gap-2 md:col-span-2">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold">CANT.:</label>
              <input className="xp-input" type="number" value={form.cantidad} onChange={e => handleChange('cantidad', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold">PRECIO:</label>
              <input className="xp-input" type="number" step="any" value={form.precio} onChange={e => handleChange('precio', e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold">💳 PAGO:</label>
              <select className="xp-input bg-white" value={form.metodoPagoId} onChange={e => handleChange('metodoPagoId', e.target.value)} required>
                <option value="">...</option>
                {catalogos?.metodosPago?.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="flex justify-end gap-2 mt-2">
        <button type="button" className="xp-btn xp-btn-blue px-6 py-2" onClick={onDone}>CANCELAR</button>
        <button type="submit" className={`xp-btn ${isEditing ? 'xp-btn-orange' : 'xp-btn-green'} px-8 py-2 font-bold`} disabled={loading}>
          {loading ? 'PROCESANDO...' : isEditing ? '💾 ACTUALIZAR' : '➕ REGISTRAR'}
        </button>
      </div>
    </form>
  );
}