import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { XPWindow } from '@/components/XPWindow';
import { PedidoTable } from '@/components/PedidoTable';
import { PedidoForm } from '@/components/PedidoForm';
import { WaterSpinner } from '@/components/WaterSpinner';
import { XPToastContainer } from '@/components/XPToast';
import blissBg from '@/assets/bliss-bg.jpg';

// --- INTERFACES ---
type ViewMode = 'list' | 'form';

interface Pedido {
  id: number;
  nombre_cliente: string;
  telefono: string;
  direccion_entrega: string;
  ciudadId: number;
  restauranteId: number;
  categoriaId: number;
  metodoPagoId: number;
  ciudad: { nombre: string }; 
  restaurante: { nombre: string };
  categoria: { nombre: string };
  metodoPago: { nombre: string };
  codigo_postal: number;
  producto: string;
  cantidad: number;
  precio: number;
  propina: number;
  instrucciones_entrega: string;
}

interface Cancion {
  titulo: string;
  artista: string;
  url: string;
  portada: string;
}
const GET_FORM_CATALOGS = gql`
  query ObtenerCatalogosFormulario {
    # El nombre ANTES de los ':' es como lo llamas en React
    # El nombre DESPUÉS de los ':' debe ser el nombre REAL en tu servidor
    
    ciudades: catalogCiudad { id nombre }
    restaurantes: catalogRestaurante{ id nombre }
    categorias: catalogCategoria { id nombre }
    metodosPago: catalogMetodoPago { id nombre }
  }
`;


const GET_PEDIDOS_CON_RELACIONES = gql`
  query ObtenerPedidos {
    pedidos {
      id
      nombre_cliente
      telefono
      direccion_entrega
      ciudadId
      restauranteId
      categoriaId
      metodoPagoId
      ciudad { nombre }
      restaurante { nombre }
      categoria { nombre }
      metodoPago { nombre }
      codigo_postal
      producto
      cantidad
      precio
      propina
      instrucciones_entrega
    }
  }
`;

const playlist: Cancion[] = [
  {
    titulo: "D_E_A_T_H_M_E_T_A_L - Panchiko",
    artista: "Panchiko",
    url: new URL('@/assets/D_E_A_T_H_M_E_T_A_L - Panchiko.mp3', import.meta.url).href,
    portada: "https://f4.bcbits.com/img/a1203542687_1x1_700.avif"
  },
  {
    titulo: "Bôa - Duvet",
    artista: "Bôa",
    url: new URL('@/assets/Bôa -  Duvet (Official Video).mp3', import.meta.url).href,
    portada: "https://imgs.search.brave.com/79O0uW1uUztujGmOaSDLL70JRu6mGnixTpLgDhDc5Fg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmF1/ZGlvbWFjay5jb20v/Ym9hLzFhMjU0M2Nk/MDcud2VicD93aWR0/aD0zNjA"
  }
];

export default function Index() {
  const [view, setView] = useState<ViewMode | string>('list');
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);

  // 🛒 DATA QUERIES (Solo una vez cada una)
  const { data: catalogosData, loading: loadingCatalogos } = useQuery(GET_FORM_CATALOGS);
  const { data, loading, error } = useQuery<{ pedidos: Pedido[] }>(GET_PEDIDOS_CON_RELACIONES);

  // 🎵 MUSICA STATE
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = playlist[currentSongIndex];

  // 🛠️ HANDLERS
  const handleCloseModal = () => {
    setView('list');
    setEditingPedido(null);
  };

  const handleEdit = (pedido: Pedido) => {
    setEditingPedido(pedido);
    setView('form');
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } 
    else { audioRef.current.play().catch(() => console.log("Interacción requerida")); }
    setIsPlaying(!isPlaying);
  };

  const changeSong = (index: number) => {
    let newIndex = index;
    if (newIndex < 0) newIndex = playlist.length - 1;
    if (newIndex >= playlist.length) newIndex = 0;
    setCurrentSongIndex(newIndex);
    setIsPlaying(true);
    setTimeout(() => { audioRef.current?.play().catch(() => setIsPlaying(false)); }, 100);
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat p-4 md:p-8 relative overflow-hidden" style={{ backgroundImage: `url(${blissBg})` }}>
      <XPToastContainer />

      {/* 🎵 REPRODUCTOR */}
      <div className="relative z-10 border border-neutral-400 bg-[#E0DFE3] shadow-[inset_1px_1px_#fff,2px_2px_4px_rgba(0,0,0,0.3)] p-2 mb-6 rounded flex items-center gap-4 max-w-xl mx-auto md:mx-0">
        <div className="w-14 h-14 border border-neutral-500 bg-white p-0.5 shadow-inner">
          <img src={currentSong.portada} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="bg-white border border-neutral-300 px-2 py-1 mb-2 rounded-sm shadow-inner overflow-hidden">
            <p className="text-[10px] font-bold text-blue-900 truncate">🎵 {currentSong.titulo}</p>
            <p className="text-[9px] text-neutral-600 truncate">👤 {currentSong.artista}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => changeSong(currentSongIndex - 1)} className="xp-btn xp-btn-green px-2 text-xs">⏮</button>
            <button onClick={togglePlayPause} className="xp-btn xp-btn-blue px-4 text-xs font-bold min-w-[80px]">
              {isPlaying ? 'PAUSA' : 'PLAY'}
            </button>
            <button onClick={() => changeSong(currentSongIndex + 1)} className="xp-btn xp-btn-green px-2 text-xs">⏭</button>
          </div>
        </div>
        <audio ref={audioRef} src={currentSong.url} onEnded={() => changeSong(currentSongIndex + 1)} />
      </div>

      {/* TABS */}
      <div className="relative z-10 flex gap-1 mb-4">
        <button className={`xp-btn ${view === 'list' ? 'xp-btn-blue' : 'xp-btn-green'} px-6 py-2`} onClick={() => setView('list')}>
          📋 LISTADO
        </button>
        <button className={`xp-btn ${view === 'form' && !editingPedido ? 'xp-btn-blue' : 'xp-btn-green'} px-6 py-2`} onClick={() => { setEditingPedido(null); setView('form'); }}>
          ➕ NUEVO PEDIDO
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-10">
        {view === 'list' && (
          <XPWindow title="📦 Gestión de Pedidos - Comida">
            {loading ? <WaterSpinner /> : error ? (
              <div className="p-4 text-center">
                <p className="text-red-600 text-xs font-bold">⚠️ ERROR DE CONEXIÓN</p>
                <p className="text-[10px] text-neutral-500 mt-1">Revisa el backend en el puerto 3000.</p>
              </div>
            ) : (
              <PedidoTable pedidos={data?.pedidos ?? []} onEdit={handleEdit} />
            )}
          </XPWindow>
        )}

        {view === 'form' && (
          <XPWindow title={editingPedido ? `✏️ Editando Pedido #${editingPedido.id}` : '➕ Registro de Pedido'} onClose={handleCloseModal}>
            {loadingCatalogos ? (
              <div className="flex flex-col items-center py-10 gap-2">
                <WaterSpinner />
                <p className="text-[10px] font-bold text-blue-800">SINCRONIZANDO CATÁLOGOS...</p>
              </div>
            ) : (
              <PedidoForm
                onDone={handleCloseModal}
                editingPedido={editingPedido}
                catalogos={{
                  ciudades: (catalogosData as any)?.ciudades || [],
                  restaurantes: (catalogosData as any)?.restaurantes || [],
                  categorias: (catalogosData as any)?.categorias || [],
                  metodosPago: (catalogosData as any)?.metodosPago || []
                }}
              />
            )}
          </XPWindow>
        )}
      </div>
    </div>
  );
}