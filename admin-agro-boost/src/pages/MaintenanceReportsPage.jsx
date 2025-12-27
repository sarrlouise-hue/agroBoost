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

    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            try {
                const res = await api.get('/maintenances/stats/reports');
                const rawData = res.data?.data || {};

                // 1. GÉNÉRATION DES 6 DERNIERS MOIS (pour un graphique complet)
                const last6Months = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    last6Months.push({
                        key: d.toISOString().slice(0, 7), // Format "YYYY-MM" pour comparer
                        name: d.toLocaleDateString('fr-FR', { month: 'short' }), // "janv.", "févr."...
                        cost: 0
                    });
                }

                // 2. MAPPING DES DONNÉES DE L'API SUR CES MOIS
                const mappedMonthly = last6Months.map(monthObj => {
                    const found = (rawData.costByMonth || []).find(item => 
                        item.month && item.month.startsWith(monthObj.key)
                    );
                    return {
                        name: monthObj.name,
                        cost: found ? parseFloat(found.totalCost) : 0
                    };
                });

                // 3. RÉPARTITION PAR TYPE
                const mappedTypes = (rawData.countByType || []).map(item => ({
                    name: item.serviceType.charAt(0).toUpperCase() + item.serviceType.slice(1),
                    value: parseInt(item.count)
                }));

                setData({
                    monthlyCosts: mappedMonthly,
                    typeDistribution: mappedTypes,
                    totals: { 
                        cost: mappedMonthly.reduce((acc, curr) => acc + curr.cost, 0), 
                        count: mappedTypes.reduce((acc, curr) => acc + curr.value, 0) 
                    }
                });
            } catch (err) {
                setError("Impossible de charger les analyses.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, []);

    if (loading) return <div style={centerStyle}>Calcul des indicateurs...</div>;
    if (error) return <div style={centerStyle}>{error}</div>;

    return (
        <div className="reports-container">
            <style>{`
                .reports-container { 
                    padding: 10px 5px; 
                    background-color: #f8f9fa; 
                    min-height: 100vh; 
                    font-family: 'Inter', sans-serif;
                }
                
                .reports-header { margin-bottom: 25px; padding: 0 5px; }
                
                .reports-header h1 { 
                    color: #0070AB; 
                    margin: 0; 
                    display: flex; 
                    align-items: flex-start; 
                    gap: 12px;
                    font-size: clamp(1.1rem, 5vw, 1.8rem);
                    line-height: 1.2;
                }

                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 10px;
                    margin-bottom: 25px;
                }

                .charts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(min(100%, 450px), 1fr));
                    gap: 20px;
                }

                .chart-card {
                    background: white; 
                    padding: 15px; 
                    border-radius: 16px; 
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05); 
                    border: 1px solid #E2E8F0;
                }

                @media (min-width: 992px) {
                    .reports-container { padding: 30px; }
                    .chart-card { padding: 30px; }
                    .kpi-grid { gap: 20px; }
                }

                @media (max-width: 600px) {
                    .btn-back { width: 100%; justify-content: center; margin-bottom: 20px; }
                    .chart-container { height: 300px !important; }
                    .reports-header h1 { align-items: center; }
                }
            `}</style>

            <button onClick={() => navigate(-1)} style={btnBackStyle} className="btn-back">
                <FiArrowLeft /> RETOUR
            </button>

            <header className="reports-header">
                <h1>
                    <FiSettings style={{ flexShrink: 0 }} /> 
                    <span>Analyses & Statistiques <strong>Maintenance</strong></span>
                </h1>
                <p style={{ color: '#718096', marginTop: '8px', fontSize: '13px' }}>
                    Rapports détaillés des interventions et coûts logistiques
                </p>
            </header>

            <div className="kpi-grid">
                <div style={kpiCardStyle('#EBF8FF', '#2B6CB0')}>
                    <FiDollarSign size={20} />
                    <div>
                        <span style={kpiLabelStyle}>Coût Total (6m)</span>
                        <div style={kpiValueStyle}>{data.totals.cost.toLocaleString()} F</div>
                    </div>
                </div>
                <div style={kpiCardStyle('#F0FFF4', '#2F855A')}>
                    <FiActivity size={20} />
                    <div>
                        <span style={kpiLabelStyle}>Interventions</span>
                        <div style={kpiValueStyle}>{data.totals.count}</div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h3 style={cardTitleStyle}><FiTrendingUp color="#0070AB" /> Évolution des charges</h3>
                    <div className="chart-container" style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={data.monthlyCosts} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} interval={0} />
                                <YAxis axisLine={false} tickLine={false} fontSize={10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    formatter={(val) => [`${val.toLocaleString()} F`, 'Coût']} 
                                />
                                <Bar dataKey="cost" fill="#0070AB" radius={[6, 6, 0, 0]} barSize={25} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

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
                                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px', fontSize: '11px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

const kpiCardStyle = (bg, color) => ({
    backgroundColor: bg,
    color: color,
    padding: '15px 12px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    border: `1px solid ${color}20`
});

const kpiLabelStyle = { fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' };
const kpiValueStyle = { fontSize: 'clamp(0.9rem, 4vw, 1.2rem)', fontWeight: '800' };

const cardTitleStyle = { fontSize: '14px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#2D3748' };
const btnBackStyle = { marginBottom: '15px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', padding: '10px 18px', borderRadius: '10px', fontWeight: '600', color: '#4A5568', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontSize: '11px' };
const centerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#A0AEC0', fontSize: '16px' };

export default MaintenanceReportsPage;