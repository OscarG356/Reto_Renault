import React, { useMemo } from 'react';
import { APIProvider, Map, Marker, Polyline } from '@vis.gl/react-google-maps';

const MapaRecorridos = ({ recorridos, montacargaSeleccionado }) => {
  // Tu API Key de Google Maps (reemplaza con tu clave real)
  const GOOGLE_MAPS_API_KEY = 'TU_API_KEY_AQUI'; // ⚠️ Reemplazar con clave real

  // Configuración del centro del mapa (Nueva York como ejemplo)
  const mapCenter = useMemo(() => ({ lat: 40.7128, lng: -74.0060 }), []);

  // Colores para diferentes montacargas
  const coloresMontacargas = {
    1: '#FF5722', // Rojo
    2: '#2196F3', // Azul
    3: '#4CAF50', // Verde
    4: '#FF9800', // Naranja
    5: '#9C27B0'  // Púrpura
  };

  // Filtrar recorridos según selección
  const recorridosFiltrados = useMemo(() => {
    if (!montacargaSeleccionado) return recorridos;
    return recorridos.filter(rec => rec.montacarga_id === parseInt(montacargaSeleccionado));
  }, [recorridos, montacargaSeleccionado]);

  // Generar marcadores y rutas
  const elementosMapa = useMemo(() => {
    const marcadores = [];
    const rutas = [];

    recorridosFiltrados.forEach((recorrido, index) => {
      const color = coloresMontacargas[recorrido.montacarga_id] || '#000000';
      
      // Agregar marcadores para inicio y fin
      if (recorrido.puntos_recorrido && recorrido.puntos_recorrido.length > 0) {
        const primerPunto = recorrido.puntos_recorrido[0];
        const ultimoPunto = recorrido.puntos_recorrido[recorrido.puntos_recorrido.length - 1];

        // Marcador de inicio
        marcadores.push(
          <Marker
            key={`inicio-${recorrido.id}`}
            position={{ lat: primerPunto.lat, lng: primerPunto.lng }}
            title={`Inicio - Montacarga ${recorrido.montacarga_id} - ${recorrido.fecha} ${primerPunto.timestamp}`}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="12" fill="${color}" stroke="white" stroke-width="3"/>
                  <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">I</text>
                </svg>
              `)}`,
              scaledSize: { width: 30, height: 30 }
            }}
          />
        );

        // Marcador de fin
        marcadores.push(
          <Marker
            key={`fin-${recorrido.id}`}
            position={{ lat: ultimoPunto.lat, lng: ultimoPunto.lng }}
            title={`Fin - Montacarga ${recorrido.montacarga_id} - ${recorrido.fecha} ${ultimoPunto.timestamp}`}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="15" cy="15" r="12" fill="${color}" stroke="white" stroke-width="3"/>
                  <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">F</text>
                </svg>
              `)}`,
              scaledSize: { width: 30, height: 30 }
            }}
          />
        );

        // Crear ruta (polyline)
        const pathCoordinates = recorrido.puntos_recorrido.map(punto => ({
          lat: punto.lat,
          lng: punto.lng
        }));

        rutas.push(
          <Polyline
            key={`ruta-${recorrido.id}`}
            path={pathCoordinates}
            options={{
              strokeColor: color,
              strokeOpacity: 0.8,
              strokeWeight: 4,
              icons: [{
                icon: {
                  path: 'M 0,-1 0,1',
                  strokeOpacity: 1,
                  scale: 4
                },
                offset: '0',
                repeat: '20px'
              }]
            }}
          />
        );

        // Marcadores para puntos intermedios
        recorrido.puntos_recorrido.slice(1, -1).forEach((punto, puntoIndex) => {
          marcadores.push(
            <Marker
              key={`punto-${recorrido.id}-${puntoIndex}`}
              position={{ lat: punto.lat, lng: punto.lng }}
              title={`Punto ${puntoIndex + 2} - ${punto.timestamp}`}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="8" fill="${color}" stroke="white" stroke-width="2"/>
                    <text x="10" y="14" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${puntoIndex + 2}</text>
                  </svg>
                `)}`,
                scaledSize: { width: 20, height: 20 }
              }}
            />
          );
        });
      }
    });

    return { marcadores, rutas };
  }, [recorridosFiltrados]);

  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'TU_API_KEY_AQUI') {
    return (
      <div className="mapa-placeholder">
        <h3>🗺️ Vista de Mapa</h3>
        <div className="api-key-warning">
          <p>⚠️ Para usar Google Maps, necesitas configurar tu API Key</p>
          <ol>
            <li>Ve a <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Habilita la API de Google Maps</li>
            <li>Crea una API Key</li>
            <li>Reemplaza 'TU_API_KEY_AQUI' en el componente MapaRecorridos.jsx</li>
          </ol>
          <p><strong>Mientras tanto, aquí tienes un mapa simulado:</strong></p>
        </div>
        <div className="mapa-simulado">
          <div className="leyenda-mapa">
            <h4>📍 Leyenda de Recorridos:</h4>
            {recorridosFiltrados.map(recorrido => (
              <div key={recorrido.id} className="item-leyenda">
                <span 
                  className="color-indicator" 
                  style={{ backgroundColor: coloresMontacargas[recorrido.montacarga_id] || '#000' }}
                ></span>
                <span>Montacarga {recorrido.montacarga_id} - {recorrido.fecha}</span>
                <span className="distancia">({recorrido.distancia_km} km)</span>
              </div>
            ))}
          </div>
          <div className="coordenadas-resumen">
            <h4>📊 Resumen de Coordenadas:</h4>
            {recorridosFiltrados.map(recorrido => (
              <div key={recorrido.id} className="coordenadas-recorrido">
                <h5>Recorrido #{recorrido.id} - {recorrido.fecha}</h5>
                <div className="puntos-grid-mini">
                  {recorrido.puntos_recorrido.map((punto, index) => (
                    <div key={index} className="punto-mini">
                      <span className="numero-punto">{index + 1}</span>
                      <span className="coords">
                        {punto.lat.toFixed(4)}, {punto.lng.toFixed(4)}
                      </span>
                      <span className="tiempo">{punto.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mapa-container">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={13}
          style={{ width: '100%', height: '500px' }}
          mapId="DEMO_MAP_ID"
        >
          {elementosMapa.marcadores}
          {elementosMapa.rutas}
        </Map>
      </APIProvider>
      
      <div className="controles-mapa">
        <div className="leyenda-colores">
          <h4>🎨 Leyenda de Montacargas:</h4>
          {Object.entries(coloresMontacargas).map(([id, color]) => (
            <div key={id} className="item-leyenda">
              <span className="color-indicator" style={{ backgroundColor: color }}></span>
              <span>Montacarga {id}</span>
            </div>
          ))}
        </div>
        
        <div className="stats-mapa">
          <p><strong>📍 Recorridos mostrados:</strong> {recorridosFiltrados.length}</p>
          <p><strong>🚛 Montacargas activos:</strong> {new Set(recorridosFiltrados.map(r => r.montacarga_id)).size}</p>
        </div>
      </div>
    </div>
  );
};

export default MapaRecorridos;
