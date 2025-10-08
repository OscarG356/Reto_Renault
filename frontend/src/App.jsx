import { useState, useEffect } from 'react'
import axios from 'axios'
import './Dashboard.css'
import './Mapa.css'
import GoogleMap from './GoogleMap'

// Configurar la URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [montacargas, setMontacargas] = useState([])
  const [recorridos, setRecorridos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMontacarga, setSelectedMontacarga] = useState('')
  const [dashboardData, setDashboardData] = useState({
    totalRecorridos: 0,
    distanciaTotal: 0,
    tiempoTotal: 0,
    velocidadPromedio: 0,
    estadoOperativo: 'Activo'
  })

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchMontacargas()
    fetchRecorridos()
  }, [])

  // Recalcular métricas cuando cambie el montacarga seleccionado
  useEffect(() => {
    const recorridosFiltrados = filtrarRecorridosPorMontacarga()
    calcularDashboardData(recorridosFiltrados)
  }, [selectedMontacarga, recorridos])

  const fetchMontacargas = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/api/montacargas`)
      setMontacargas(response.data)
      setError(null)
    } catch (err) {
      setError('Error al cargar los montacargas')
      console.error('Error:', err)
      // Datos de ejemplo si falla la API
      setMontacargas([
        { id: 1, codigo: 'MC-001', modelo: 'Toyota 8FBN25', estado: 'Activo' },
        { id: 2, codigo: 'MC-002', modelo: 'Caterpillar DP25N', estado: 'Mantenimiento' },
        { id: 3, codigo: 'MC-003', modelo: 'Hyundai 25D-7E', estado: 'Activo' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchRecorridos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recorridos`)
      setRecorridos(response.data)
      calcularDashboardData(response.data)
    } catch (err) {
      console.error('Error al cargar recorridos:', err)
      // Datos de ejemplo si falla la API
      const recorridosEjemplo = [
        {
          id: 1,
          montacarga_id: 1,
          fecha: '2025-09-07',
          hora_inicio: '08:00',
          hora_fin: '08:45',
          distancia_km: 2.5,
          puntos_recorrido: [
            { lat: 40.7128, lng: -74.0060, timestamp: '08:00' },
            { lat: 40.7130, lng: -74.0058, timestamp: '08:15' },
            { lat: 40.7135, lng: -74.0055, timestamp: '08:30' },
            { lat: 40.7140, lng: -74.0050, timestamp: '08:45' }
          ]
        },
        {
          id: 2,
          montacarga_id: 1,
          fecha: '2025-09-07',
          hora_inicio: '09:00',
          hora_fin: '10:30',
          distancia_km: 4.2,
          puntos_recorrido: [
            { lat: 40.7140, lng: -74.0050, timestamp: '09:00' },
            { lat: 40.7145, lng: -74.0045, timestamp: '09:30' },
            { lat: 40.7150, lng: -74.0040, timestamp: '10:00' },
            { lat: 40.7155, lng: -74.0035, timestamp: '10:30' }
          ]
        }
      ]
      setRecorridos(recorridosEjemplo)
      calcularDashboardData(recorridosEjemplo)
    }
  }

  const filtrarRecorridosPorMontacarga = () => {
    if (!selectedMontacarga) return recorridos
    return recorridos.filter(rec => rec.montacarga_id === parseInt(selectedMontacarga))
  }

  const calcularDashboardData = (recorridosData) => {
    const totalRecorridos = recorridosData.length
    const distanciaTotal = recorridosData.reduce((sum, rec) => sum + rec.distancia_km, 0)
    
    // Calcular tiempo total en minutos
    let tiempoTotal = 0
    recorridosData.forEach(rec => {
      const inicio = new Date(`2025-09-07 ${rec.hora_inicio}`)
      const fin = new Date(`2025-09-07 ${rec.hora_fin}`)
      tiempoTotal += (fin - inicio) / (1000 * 60) // minutos
    })
    
    const velocidadPromedio = tiempoTotal > 0 ? (distanciaTotal / (tiempoTotal / 60)).toFixed(2) : 0
    
    // Determinar estado operativo basado en el montacarga seleccionado
    let estadoOperativo = 'Activo'
    if (selectedMontacarga && montacargas.length > 0) {
      const montacargaSeleccionado = montacargas.find(mc => mc.id === parseInt(selectedMontacarga))
      estadoOperativo = montacargaSeleccionado ? montacargaSeleccionado.estado : 'Activo'
    }
    
    setDashboardData({
      totalRecorridos,
      distanciaTotal: distanciaTotal.toFixed(2),
      tiempoTotal: Math.round(tiempoTotal),
      velocidadPromedio,
      estadoOperativo
    })
  }

  if (loading) {
    return <div className="loading">🔄 Cargando dashboard...</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏭 Dashboard Montacargas - Reto Renault</h1>
        <p>Visualización de datos de recorrido y operación</p>
      </header>

      <main className="App-main">
        {error && <div className="error">{error}</div>}

        {/* Selector de Montacargas */}
        <section className="selector-section">
          <h2>📋 Seleccionar Montacargas</h2>
          <div className="custom-selector">
            <select 
              value={selectedMontacarga} 
              onChange={(e) => setSelectedMontacarga(e.target.value)}
              className="montacarga-selector"
            >
              <option value="">Todos los montacargas</option>
              {montacargas.map(mc => (
                <option key={mc.id} value={mc.id}>
                  {mc.codigo} - {mc.modelo} ({mc.estado})
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Dashboard de Métricas */}
        <section className="dashboard-section">
          <h2>📊 Métricas de Operación 
            {selectedMontacarga && (
              <span className="selected-montacarga">
                - {montacargas.find(mc => mc.id === parseInt(selectedMontacarga))?.codigo || 'N/A'}
              </span>
            )}
          </h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>🚚 Total Recorridos</h3>
              <p className="metric-value">{dashboardData.totalRecorridos}</p>
            </div>
            <div className="metric-card">
              <h3>📏 Distancia Total</h3>
              <p className="metric-value">{dashboardData.distanciaTotal} km</p>
            </div>
            <div className="metric-card">
              <h3>⏱️ Tiempo Total</h3>
              <p className="metric-value">{dashboardData.tiempoTotal} min</p>
            </div>
            <div className="metric-card">
              <h3>🏃 Velocidad Promedio</h3>
              <p className="metric-value">{dashboardData.velocidadPromedio} km/h</p>
            </div>
          </div>
        </section>

        {/* Lista de Montacargas */}
        <section className="montacargas-section">
          <h2>🚛 Flota de Montacargas</h2>
          <div className="montacargas-grid">
            {montacargas.map(mc => (
              <div key={mc.id} className={`montacarga-card ${mc.estado.toLowerCase()}`}>
                <h3>{mc.codigo}</h3>
                <p><strong>Modelo:</strong> {mc.modelo}</p>
                <p><strong>Estado:</strong> 
                  <span className={`status ${mc.estado.toLowerCase()}`}>
                    {mc.estado === 'Activo' ? '🟢' : '🟡'} {mc.estado}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Historial de Recorridos */}
        <section className="recorridos-section">
          <h2>📍 Historial de Recorridos</h2>
          <div className="recorridos-list">
            {filtrarRecorridosPorMontacarga().length > 0 ? (
              filtrarRecorridosPorMontacarga().map(recorrido => (
                <div key={recorrido.id} className="recorrido-card">
                  <div className="recorrido-header">
                    <h3>🗓️ {recorrido.fecha}</h3>
                    <span className="montacarga-id">Montacarga #{recorrido.montacarga_id}</span>
                  </div>
                  <div className="recorrido-details">
                    <p><strong>⏰ Horario:</strong> {recorrido.hora_inicio} - {recorrido.hora_fin}</p>
                    <p><strong>📏 Distancia:</strong> {recorrido.distancia_km} km</p>
                    <p><strong>📍 Puntos de recorrido:</strong> {recorrido.puntos_recorrido.length} coordenadas</p>
                  </div>
                  <div className="puntos-recorrido">
                    <h4>🗺️ Ruta:</h4>
                    <div className="puntos-grid">
                      {recorrido.puntos_recorrido.map((punto, index) => (
                        <div key={index} className="punto-card">
                          <span className="punto-numero">{index + 1}</span>
                          <div className="coordenadas">
                            <small>Lat: {punto.lat}</small>
                            <small>Lng: {punto.lng}</small>
                            <small>⏰ {punto.timestamp}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">📭 No hay recorridos disponibles</p>
            )}
          </div>
        </section>

        {/* Sección del Mapa */}
        <section className="mapa-section">
          <h2>🗺️ Visualización de Recorridos en Mapa</h2>
          <GoogleMap 
            recorridos={recorridos}
            montacargaSeleccionado={selectedMontacarga}
          />
        </section>
      </main>
    </div>
  )
}

export default App
