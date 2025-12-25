import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiPieChart, FiDollarSign, FiArrowLeft, FiSettings, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const COLORS = ['#0070AB', '#4CAF50', '#FF9800', '#F44336', '#9C27B0'];

function MaintenanceReportsPage() {
    const navigate = useNavigate();
    const [data, setData] = useState({ monthlyCosts: [], typeDistribution: [], totals: { cost: 0, count: 0 } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getMonthName = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', { month: 'short' });
    };

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            try {
                const res = await api.get('/maintenances/stats/reports');
                const rawData = res.data?.data || {};

                const mappedMonthly = (rawData.costByMonth || []).map(item => ({
                    name: getMonthName(item.month),
                    cost: parseFloat(item.totalCost)
                })).reverse();

                const mappedTypes = (rawData.countByType || []).map(item => ({
                    name: item.serviceType.charAt(0).toUpperCase() + item.serviceType.slice(1),
                    value: parseInt(item.count)
                }));

                const totalCost = mappedMonthly.reduce((acc, curr) => acc + curr.cost, 0);
                const totalInterventions = mappedTypes.reduce((acc, curr) => acc + curr.value, 0);

                setData({
                    monthlyCosts: mappedMonthly,
                    typeDistribution: mappedTypes,
                    totals: { cost: totalCost, count: totalInterventions }
                });
            } catch (err) {
                setError("Impossible de charger les analyses.");
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    if (loading) return <div style={centerStyle}>Calcul des indicateurs...</div>;

    return (
        <div className="reports-container">
            <style>{`
                .reports-container { 
                    padding: clamp(15px, 4vw, 30px); 
                    background-color: #f8f9fa; 
                    min-height: 100vh; 
                    font-family: 'Inter', sans-serif;
                }
                
                .reports-header { margin-bottom: 35px; }
                .reports-header h1 { 
                    color: #0070AB; 
                    margin: 0; 
                    display: flex; 
                    align-items: center; 
                    gap: 15px;
                    font-size: clamp(1.2rem, 5vw, 1.8rem);
                }

                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .charts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr));
                    gap: 30px;
                }

                .chart-card {
                    background: white; 
                    padding: clamp(15px, 3vw, 30px); 
                    border-radius: 16px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
                    border: 1px solid #E2E8F0;
                }

                @media (max-width: 600px) {
                    .btn-back { width: 100%; justify-content: center; margin-bottom: 25px; }
                    .chart-container { height: 300px !important; }
                }
            `}</style>

            <button onClick={() => navigate(-1)} style={btnBackStyle} className="btn-back">
                <FiArrowLeft /> Retour
            </button>

            <header className="reports-header">
                <h1>
                    <FiSettings /> Analyses & Statistiques <strong>Maintenance</strong>
                </h1>
                <p style={{ color: '#718096', marginTop: '5px', fontSize: '14px' }}>
                    Rapports détaillés des interventions et coûts logistiques
                </p>
            </header>

            {/* CARTES DE RÉSUMÉ (KPI) */}
            <div className="kpi-grid">
                <div style={kpiCardStyle('#EBF8FF', '#2B6CB0')}>
                    <FiDollarSign size={24} />
                    <div>
                        <span style={kpiLabelStyle}>Coût Total Période</span>
                        <div style={kpiValueStyle}>{data.totals.cost.toLocaleString()} XOF</div>
                    </div>
                </div>
                <div style={kpiCardStyle('#F0FFF4', '#2F855A')}>
                    <FiActivity size={24} />
                    <div>
                        <span style={kpiLabelStyle}>Total Interventions</span>
                        <div style={kpiValueStyle}>{data.totals.count} réalisés</div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* GRAPHIQUE BARRES */}
                <div className="chart-card">
                    <h3 style={cardTitleStyle}><FiTrendingUp color="#0070AB" /> Évolution des charges financières</h3>
                    <div className="chart-container" style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={data.monthlyCosts}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} width={40} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(val) => [`${val.toLocaleString()} XOF`, 'Coût']} 
                                />
                                <Bar dataKey="cost" fill="#0070AB" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAPHIQUE CAMEMBERT */}
                <div className="chart-card">
                    <h3 style={cardTitleStyle}><FiPieChart color="#4CAF50" /> Répartition par type</h3>
                    <div className="chart-container" style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie 
                                    data={data.typeDistribution} 
                                    innerRadius="60%" 
                                    outerRadius="80%" 
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.typeDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

// STYLES INLINE RESTANTS
const kpiCardStyle = (bg, color) => ({
    backgroundColor: bg,
    color: color,
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    border: `1px solid ${color}20`
});

const kpiLabelStyle = { fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' };
const kpiValueStyle = { fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: '800' };

const cardTitleStyle = { fontSize: '15px', fontWeight: '600', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', color: '#2D3748' };
const btnBackStyle = { marginBottom: '20px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', padding: '10px 18px', borderRadius: '10px', fontWeight: '600', color: '#4A5568', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s' };
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#A0AEC0', fontSize: '16px' };

export default MaintenanceReportsPage;