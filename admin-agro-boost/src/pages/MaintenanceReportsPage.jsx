import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiPieChart, FiDollarSign, FiArrowLeft, FiBarChart2, FiActivity } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Thème de couleurs : Vert (Succès) 
const SUCCESS_COLOR = '#2ECC71';
const DARK_ACCENT = '#2D3748';
const COLORS = [SUCCESS_COLOR, DARK_ACCENT, '#4A5568', '#718096', '#A0AEC0'];

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

                // Génération des 6 derniers mois
                const last6Months = [];
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    last6Months.push({
                        key: d.toISOString().slice(0, 7),
                        name: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
                        cost: 0
                    });
                }

                const mappedMonthly = last6Months.map(monthObj => {
                    const found = (rawData.costByMonth || []).find(item => 
                        item.month && item.month.startsWith(monthObj.key)
                    );
                    return {
                        name: monthObj.name,
                        cost: found ? parseFloat(found.totalCost) : 0
                    };
                });

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

    if (loading) return <div style={centerStyle}>Chargement des analyses...</div>;

    return (
        <div className="reports-page-wrapper">
            <style>{`
                .reports-page-wrapper { 
                    padding: 0; 
                    background-color: #F8FAFC; 
                    min-height: 100vh; 
                    font-family: 'Inter', sans-serif;
                }
                
                .inner-container { padding: 15px; max-width: 1100px; margin: 0 auto; }

                .page-header h1 { 
                    color: ${DARK_ACCENT}; 
                    font-weight: 900; 
                    margin: 0; 
                    display: flex; 
                    align-items: center; 
                    gap: 12px;
                    font-size: 1.4rem;
                    text-transform: uppercase;
                }

                .kpi-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin: 20px 0;
                }

                .kpi-box {
                    background: white;
                    padding: 18px 12px;
                    border-radius: 16px;
                    border: 1px solid #E2E8F0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }

                .chart-section {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .card-container {
                    background: white; 
                    padding: 20px 10px; 
                    border-radius: 20px; 
                    border: 1px solid #E2E8F0;
                }

                .card-header-title {
                    font-size: 13px;
                    font-weight: 800;
                    color: ${DARK_ACCENT};
                    text-transform: uppercase;
                    margin-bottom: 25px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    letter-spacing: 0.5px;
                }

                @media (min-width: 768px) {
                    .inner-container { padding: 30px; }
                    .kpi-row { grid-template-columns: repeat(2, 280px); }
                    .chart-section { display: grid; grid-template-columns: 1fr 1fr; }
                    .kpi-box { flex-direction: row; text-align: left; gap: 15px; padding: 25px; }
                }
            `}</style>

            <div className="inner-container">
                <button onClick={() => navigate(-1)} style={backButtonStyle}>
                    <FiArrowLeft size={16} /> Retour
                </button>

                <header className="page-header">
                    <h1><FiBarChart2 size={26} color={SUCCESS_COLOR} /> Statistiques</h1>
                    <p style={{ color: '#64748B', marginTop: '6px', fontSize: '13px', fontWeight: '500' }}>
                        Suivi des coûts et activités de maintenance
                    </p>
                </header>

                <div className="kpi-row">
                    <div className="kpi-box">
                        <div style={{ ...iconCircleStyle, background: '#DCFCE7', color: SUCCESS_COLOR }}>
                            <FiDollarSign size={20} />
                        </div>
                        <div>
                            <div style={labelMiniStyle}>Coût Total</div>
                            <div style={kpiNumberStyle}>{data.totals.cost.toLocaleString()} <small style={{fontSize: '10px'}}>XOF</small></div>
                        </div>
                    </div>

                    <div className="kpi-box">
                        <div style={{ ...iconCircleStyle, background: '#F1F5F9', color: DARK_ACCENT }}>
                            <FiActivity size={20} />
                        </div>
                        <div>
                            <div style={labelMiniStyle}>Interventions</div>
                            <div style={kpiNumberStyle}>{data.totals.count}</div>
                        </div>
                    </div>
                </div>

                <div className="chart-section">
                    <div className="card-container">
                        <h3 className="card-header-title"><FiTrendingUp color={SUCCESS_COLOR} /> Évolution des Coûts</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={data.monthlyCosts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} fontWeight="700" />
                                    <YAxis axisLine={false} tickLine={false} fontSize={10} />
                                    <Tooltip 
                                        cursor={{ fill: '#F8FAFC' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 15px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="cost" fill={SUCCESS_COLOR} radius={[4, 4, 0, 0]} barSize={28} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card-container">
                        <h3 className="card-header-title"><FiPieChart color={SUCCESS_COLOR} /> Types de Service</h3>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie 
                                        data={data.typeDistribution} 
                                        innerRadius="65%" 
                                        outerRadius="85%" 
                                        paddingAngle={6}
                                        dataKey="value"
                                    >
                                        {data.typeDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: '700', paddingTop: '15px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styles Objects
const labelMiniStyle = { 
    fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', color: '#94A3B8', letterSpacing: '0.5px' 
};

const kpiNumberStyle = { 
    fontSize: '1.2rem', fontWeight: '900', color: DARK_ACCENT 
};

const iconCircleStyle = {
    width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px'
};

const backButtonStyle = { 
    marginBottom: '20px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', 
    padding: '8px 16px', borderRadius: '10px', fontWeight: '800', color: DARK_ACCENT, 
    display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', fontSize: '10px' 
};

const centerStyle = { 
    display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', 
    color: '#64748B', fontWeight: '700', fontSize: '15px' 
};

export default MaintenanceReportsPage;