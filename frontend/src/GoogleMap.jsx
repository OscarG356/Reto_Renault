import React, { useEffect, useRef, useState } from 'react';

const GoogleMap = ({ recorridos, montacargaSeleccionado }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  // Colores para diferentes montacargas
  const coloresMontacargas = {
    1: '#FF5722', // Rojo
    2: '#2196F3', // Azul
    3: '#4CAF50', // Verde
    4: '#FF9800', // Naranja
    5: '#9C27B0'  // Púrpura
  };

  // Función para cargar Google Maps dinámicamente
  const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
      // Verificar si ya está cargado
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      // Obtener API key desde variables de entorno
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey || apiKey === 'TU_API_KEY_REAL_AQUI') {
        reject(new Error('⚠️ API Key de Google Maps no configurada. Configura VITE_GOOGLE_MAPS_API_KEY en el archivo .env.local'));
        return;
      }

      // Crear y cargar el script dinámicamente
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('✅ Google Maps API cargada correctamente');
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('❌ Error al cargar Google Maps API. Verifica tu API key y conexión.'));
      };

      document.head.appendChild(script);
    });
  };

  // Inicializar el mapa
  const initializeMap = async () => {
    try {
      console.log('🗺️ Iniciando carga de Google Maps...');
      await loadGoogleMapsScript();

      console.log('✅ Google Maps cargado, inicializando mapa...');
      console.log('mapRef.current:', mapRef.current);
      console.log('window.google:', window.google);

      if (mapRef.current && window.google) {
        console.log('🔧 Creando instancia del mapa...');
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 }, // Nueva York como centro por defecto
          zoom: 14,
          mapTypeId: 'roadmap',
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#ffffff' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#5c5c5c' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#f8c967' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#a2daf2' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ color: '#f0f0f0' }]
            }
          ]
        });

        console.log('✅ Mapa inicializado correctamente');
        setMap(mapInstance);
        setMapLoaded(true);
      } else {
        console.error('❌ mapRef.current o window.google no están disponibles');
        if (!mapRef.current) console.error('❌ mapRef.current es null');
        if (!window.google) console.error('❌ window.google no está disponible');
      }
    } catch (error) {
      console.error('❌ Error loading Google Maps:', error);
      console.error('Error detallado:', error.message);
      setMapLoaded(false);
      setError(error.message);
    }
  };

  // Limpiar marcadores y polylines
  const clearMapElements = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];
  };

  // Función para crear InfoWindow con estilo mejorado
  const createInfoWindow = (recorrido, puntos, tipo = 'general', puntoIndex = null) => {
    let content = '';
    
    if (tipo === 'general') {
      content = `
        <div style="
          padding: 15px; 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          color: #333; 
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          min-width: 250px;
          position: relative;
        ">
          <button onclick="google.maps.event.trigger(this.parentElement.parentElement.parentElement, 'closeclick')" style="
            position: absolute;
            top: 8px;
            right: 8px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          ">×</button>
          <h3 style="
            margin: 0 0 12px 0; 
            color: ${coloresMontacargas[recorrido.montacarga_id] || '#666'}; 
            font-size: 18px;
            font-weight: bold;
            border-bottom: 2px solid ${coloresMontacargas[recorrido.montacarga_id] || '#666'};
            padding-bottom: 8px;
            padding-right: 30px;
          ">🚚 Montacarga #${recorrido.montacarga_id}</h3>
          <div style="line-height: 1.6;">
            <p style="margin: 8px 0; color: #444; font-size: 14px;">
              <strong style="color: #666;">📅 Fecha:</strong> 
              <span style="color: #333;">${recorrido.fecha}</span>
            </p>
            <p style="margin: 8px 0; color: #444; font-size: 14px;">
              <strong style="color: #666;">🕐 Horario:</strong> 
              <span style="color: #333;">${recorrido.hora_inicio} - ${recorrido.hora_fin}</span>
            </p>
            <p style="margin: 8px 0; color: #444; font-size: 14px;">
              <strong style="color: #666;">📏 Distancia:</strong> 
              <span style="color: #333;">${recorrido.distancia_km} km</span>
            </p>
            <p style="margin: 8px 0; color: #444; font-size: 14px;">
              <strong style="color: #666;">📍 Puntos:</strong> 
              <span style="color: #333;">${puntos.length} coordenadas</span>
            </p>
          </div>
        </div>
      `;
    } else if (tipo === 'punto' && puntoIndex !== null) {
      const punto = puntos[puntoIndex];
      content = `
        <div style="
          padding: 12px; 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          color: #333; 
          background-color: white;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          min-width: 200px;
          position: relative;
        ">
          <button onclick="google.maps.event.trigger(this.parentElement.parentElement.parentElement, 'closeclick')" style="
            position: absolute;
            top: 6px;
            right: 6px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          ">×</button>
          <h4 style="
            margin: 0 0 10px 0; 
            color: ${coloresMontacargas[recorrido.montacarga_id] || '#666'}; 
            font-size: 16px;
            font-weight: bold;
            padding-right: 25px;
          ">📍 Punto ${puntoIndex + 1}</h4>
          <div style="line-height: 1.5;">
            <p style="margin: 6px 0; color: #444; font-size: 13px;">
              <strong style="color: #666;">🚚 Montacarga:</strong> 
              <span style="color: #333;">#${recorrido.montacarga_id}</span>
            </p>
            <p style="margin: 6px 0; color: #444; font-size: 13px;">
              <strong style="color: #666;">📍 Coordenadas:</strong> 
              <span style="color: #333;">${punto.lat.toFixed(6)}, ${punto.lng.toFixed(6)}</span>
            </p>
            <p style="margin: 6px 0; color: #444; font-size: 13px;">
              <strong style="color: #666;">⏰ Timestamp:</strong> 
              <span style="color: #333;">${punto.timestamp}</span>
            </p>
          </div>
        </div>
      `;
    }
    
    const infoWindow = new window.google.maps.InfoWindow({
      content: content,
      maxWidth: 350,
      pixelOffset: new window.google.maps.Size(0, -5)
    });

    // Agregar event listener para cerrar el InfoWindow cuando se haga clic en el botón personalizado
    infoWindow.addListener('domready', () => {
      const closeButtons = document.querySelectorAll('.gm-style-iw button');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          infoWindow.close();
        });
      });
    });

    return infoWindow;
  };

  // Renderizar recorridos en el mapa
  const renderRecorridos = () => {
    if (!map || !window.google) return;

    clearMapElements();

    // Filtrar recorridos según selección
    const recorridosFiltrados = montacargaSeleccionado 
      ? recorridos.filter(rec => rec.montacarga_id === parseInt(montacargaSeleccionado))
      : recorridos;

    const bounds = new window.google.maps.LatLngBounds();

    recorridosFiltrados.forEach((recorrido, index) => {
      const color = coloresMontacargas[recorrido.montacarga_id] || '#666666';
      const puntos = recorrido.puntos_recorrido || [];

      if (puntos.length > 0) {
        // Crear marcador de inicio
        const inicioMarker = new window.google.maps.Marker({
          position: { lat: puntos[0].lat, lng: puntos[0].lng },
          map: map,
          title: `Inicio - Montacarga ${recorrido.montacarga_id}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        // Crear marcador de fin
        const finMarker = new window.google.maps.Marker({
          position: { lat: puntos[puntos.length - 1].lat, lng: puntos[puntos.length - 1].lng },
          map: map,
          title: `Fin - Montacarga ${recorrido.montacarga_id}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: color,
            fillOpacity: 0.7,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        markersRef.current.push(inicioMarker, finMarker);

        // Crear marcadores para puntos individuales (más pequeños)
        puntos.forEach((punto, index) => {
          // Solo crear marcadores para puntos intermedios (no inicio ni fin)
          if (index > 0 && index < puntos.length - 1) {
            const pointMarker = new window.google.maps.Marker({
              position: { lat: punto.lat, lng: punto.lng },
              map: map,
              title: `Punto ${index + 1} - Montacarga ${recorrido.montacarga_id}`,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 4,
                fillColor: color,
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 1
              },
              zIndex: 100 + index
            });

            // InfoWindow específico para este punto
            const pointInfoWindow = createInfoWindow(recorrido, puntos, 'punto', index);
            
            pointMarker.addListener('click', () => {
              pointInfoWindow.open(map, pointMarker);
            });

            markersRef.current.push(pointMarker);
          }
        });

        // Crear polyline para la ruta
        const polyline = new window.google.maps.Polyline({
          path: puntos.map(punto => ({ lat: punto.lat, lng: punto.lng })),
          geodesic: true,
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 3,
          map: map
        });

        polylinesRef.current.push(polyline);

        // Agregar puntos al bounds
        puntos.forEach(punto => {
          bounds.extend({ lat: punto.lat, lng: punto.lng });
        });

        // Info windows con la nueva función
        const infoWindow = createInfoWindow(recorrido, puntos, 'general');

        inicioMarker.addListener('click', () => {
          infoWindow.open(map, inicioMarker);
        });

        finMarker.addListener('click', () => {
          infoWindow.open(map, finMarker);
        });
      }
    });

    // Ajustar vista del mapa
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds);
    }
  };

  // Effect para inicializar el mapa
  useEffect(() => {
    initializeMap();

    // Función de limpieza
    return () => {
      if (map) {
        // Limpiar marcadores y polylines antes de desmontar
        markersRef.current.forEach(marker => {
          try {
            marker.setMap(null);
          } catch (e) {
            // Ignorar errores de limpieza
          }
        });
        polylinesRef.current.forEach(polyline => {
          try {
            polyline.setMap(null);
          } catch (e) {
            // Ignorar errores de limpieza
          }
        });
        markersRef.current = [];
        polylinesRef.current = [];
      }
    };
  }, []); // Solo ejecutar una vez al montar

  // Effect para renderizar recorridos cuando cambien
  useEffect(() => {
    if (mapLoaded && map) {
      renderRecorridos();
    }
  }, [mapLoaded, map, recorridos, montacargaSeleccionado]);

  return (
    <div className="mapa-container">
      {/* Contenedor del mapa */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        {/* Div del mapa */}
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px',
            border: '1px solid #ddd',
            display: mapLoaded ? 'block' : 'none'
          }}
        />

        {/* Overlay de carga - separado del div del mapa */}
        {!mapLoaded && (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 10px' }}></div>
              <p>🗺️ Cargando Google Maps...</p>
              {error && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#ffebee', border: '1px solid #f44336', borderRadius: '4px', maxWidth: '300px' }}>
                  <strong style={{ color: '#c62828' }}>❌ Error:</strong>
                  <p style={{ color: '#d32f2f', fontSize: '12px', margin: '5px 0 0 0' }}>{error}</p>
                </div>
              )}
              {!error && (
                <small style={{ color: '#666' }}>
                  Inicializando mapa...
                </small>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Leyenda */}
      {mapLoaded && (
        <div className="mapa-leyenda" style={{ marginTop: '10px', padding: '15px', background: '#2c3e50', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>🏷️ Leyenda:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            {Object.entries(coloresMontacargas).map(([id, color]) => (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '14px',
                    height: '14px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    border: '2px solid #fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}
                ></div>
                <span style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>Montacarga {id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
