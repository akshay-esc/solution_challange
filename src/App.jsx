import React, { useState } from 'react';
import './App.css';
import { kpiData, alertsData, shipmentsData } from './mockData';
import { 
  Activity, 
  AlertTriangle, 
  Ship, 
  Map as MapIcon, 
  Settings, 
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import MapComponent from './MapComponent';

function App() {
  const [activeAlerts, setActiveAlerts] = useState(alertsData);
  const [shipments, setShipments] = useState(shipmentsData);
  const [isGemmaLoading, setIsGemmaLoading] = useState(false);

  const handleGemmaAnalysis = async () => {
    setIsGemmaLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/analyze-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weatherData: "Blizzard conditions forming near US East Coast.",
          portData: "Port of New York operating normally."
        })
      });
      const data = await response.json();
      
      // Prepend the new alert
      setActiveAlerts(prev => [data.alert, ...prev]);
      
      // Update shipment status to critical so it can be rerouted
      setShipments(prev => prev.map(ship => {
        if (ship.id === data.alert.shipmentId) {
          return { ...ship, status: 'critical', standbyDest: "Port of Boston", standbyLat: 42.3601, standbyLng: -71.0589 };
        }
        return ship;
      }));
    } catch (error) {
      console.error("Error communicating with Gemma Backend:", error);
    } finally {
      setIsGemmaLoading(false);
    }
  };

  const handleReroute = (shipmentId, alertId) => {
    // Update shipment destination to standby port
    setShipments(prev => prev.map(ship => {
      if (ship.id === shipmentId && ship.standbyDest) {
        return {
          ...ship,
          dest: ship.standbyDest,
          destLat: ship.standbyLat,
          destLng: ship.standbyLng,
          status: 'warning' // Downgrade from critical to warning once rerouted
        };
      }
      return ship;
    }));

    // Update alert to show it was resolved
    setActiveAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          type: 'info',
          title: 'Shipment Rerouted',
          description: `Successfully diverted to standby port. Route updated.`,
          shipmentId: null
        };
      }
      return alert;
    }));
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <Activity className="text-gradient" size={28} />
          <span>Nexus<span className="text-gradient">Chain</span></span>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline"><Settings size={18} /> Settings</button>
          <button className="btn btn-primary"><Bell size={18} /> Alerts (3)</button>
        </div>
      </header>

      <main className="main-content">
        <div className="dashboard-grid">
          {/* Left Column */}
          <div>
            <div className="kpi-grid">
              {kpiData.map((kpi) => (
                <div key={kpi.id} className="glass-panel kpi-card">
                  <div className="kpi-label">{kpi.label}</div>
                  <div className="kpi-value">{kpi.value}</div>
                  <div style={{ height: '40px', width: '100%', marginTop: 'auto', marginBottom: '0.25rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={kpi.chartData}>
                        <defs>
                          <linearGradient id={`color${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={kpi.color} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={kpi.color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke={kpi.color} strokeWidth={2} fillOpacity={1} fill={`url(#color${kpi.id})`} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={`kpi-trend ${kpi.isUp ? 'trend-up' : 'trend-down'}`}>
                    {kpi.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {kpi.trend} vs last month
                  </div>
                </div>
              ))}
            </div>
            
            <div className="glass-panel map-container">
               <MapComponent shipments={shipments} />
            </div>
          </div>

          {/* Right Column */}
          <div className="alerts-panel">
            <div className="panel-header" style={{ marginBottom: '0.5rem' }}>
              <div className="panel-title">
                <AlertTriangle size={20} className="text-gradient" />
                Active Disruptions
              </div>
              <button 
                className="btn btn-primary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                onClick={handleGemmaAnalysis}
                disabled={isGemmaLoading}
              >
                {isGemmaLoading ? 'Gemma Thinking...' : '+ Generate Alert via Gemma'}
              </button>
            </div>
            
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {activeAlerts.map(alert => (
                <div key={alert.id} className={`alert-item ${alert.type}`}>
                  <div className="alert-icon">
                    {alert.type === 'critical' ? <AlertCircle size={20} color="#ef4444" /> : 
                     alert.type === 'warning' ? <AlertTriangle size={20} color="#f97316" /> : 
                     <Info size={20} color="#3b82f6" />}
                  </div>
                  <div className="alert-content">
                    <div className="alert-meta" style={{ marginBottom: '0.5rem' }}>
                      <span className={`badge ${alert.type}`}>{alert.type}</span>
                      <span>{alert.time}</span>
                    </div>
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-desc">{alert.description}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>📍 {alert.location}</span>
                      {alert.type === 'critical' && alert.shipmentId && (
                        <button 
                          className="btn btn-outline" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                          onClick={() => handleReroute(alert.shipmentId, alert.id)}
                        >
                          Simulate Reroute
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
