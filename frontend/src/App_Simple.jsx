import { useState, useEffect } from 'react'
import axios from 'axios'
import './Dashboard.css'

// Configurar la URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [montacargas, setMontacargas] = useState([])
  const [recorridos, setRecorridos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMontacarga, setSelectedMontacarga] = useState('')

  // Función para obtener datos de montacargas
  const fetchMontacargas = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/montacargas`)
      setMontacargas(response.data)
    } catch (error) {
      console.error('Error al obtener montacargas:', error)
      setError('Error al cargar los montacargas')
    }
  }

  // Función para obtener datos de recorridos
  const fetchRecorridos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/recorridos`)
      setRecorridos(response.data)
    } catch (error) {
      console.error('Error al obtener recorridos:', error)
      setError('Error al cargar los recorridos')
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchMontacargas(), fetchRecorridos()])
      setLoading(false)
    }
    
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos del dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard Montacargas</h1>
          <p>Sistema de monitoreo y control</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Selector de Montacargas */}
          <div className="card selector-card">
            <h3>Seleccionar Montacargas</h3>
            <select 
              value={selectedMontacarga} 
              onChange={(e) => setSelectedMontacarga(e.target.value)}
              className="montacarga-selector"
            >
              <option value="">Todos los montacargas</option>
              {montacargas.map(m => (
                <option key={m.id} value={m.id}>
                  {m.modelo} - {m.numero_serie}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de Recorridos */}
          <div className="card recorridos-card">
            <h3>Recorridos Recientes</h3>
            <div className="recorridos-list">
              {recorridos.slice(0, 5).map(recorrido => (
                <div key={recorrido.id} className="recorrido-item">
                  <div className="recorrido-info">
                    <span className="montacarga-id">Montacarga #{recorrido.montacarga_id}</span>
                    <span className="fecha">{new Date(recorrido.fecha_inicio).toLocaleString()}</span>
                  </div>
                  <div className="recorrido-stats">
                    <span>Distancia: {recorrido.distancia_km}km</span>
                    <span>Tiempo: {recorrido.tiempo_minutos}min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="card stats-card">
            <h3>Estadísticas Generales</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Total Montacargas</span>
                <span className="stat-value">{montacargas.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Recorridos</span>
                <span className="stat-value">{recorridos.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Distancia Total</span>
                <span className="stat-value">
                  {recorridos.reduce((sum, r) => sum + r.distancia_km, 0).toFixed(1)}km
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Tiempo Total</span>
                <span className="stat-value">
                  {recorridos.reduce((sum, r) => sum + r.tiempo_minutos, 0)}min
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
