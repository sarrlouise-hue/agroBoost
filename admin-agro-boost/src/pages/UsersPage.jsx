import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { FaUsers, FaSearch, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope } from "react-icons/fa";

// Palette de couleurs Agricole
const PRIMARY_COLOR = '#3A7C35';
const SECONDARY_COLOR = '#709D54';
const BACKGROUND_COLOR = '#FDFAF8'; 

const buttonStyle = {
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    fontFamily: 'Poppins, sans-serif'
};

const getStatusBadgeStyle = (isVerified) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    color: isVerified ? '#3A7C35' : '#9A3412',
    backgroundColor: isVerified ? '#E6FFFA' : '#FFFBEB',
    border: `1px solid ${isVerified ? '#3A7C35' : '#FEF3C7'}`,
});

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = async (searchQuery = '') => {
        setLoading(true);
        try {
            const response = await api.get(`/users`, { params: { search: searchQuery } });
            const fetchedData = response.data.data || response.data;
            setUsers(Array.isArray(fetchedData) ? fetchedData : []); 
        } catch (err) {
            console.error("Erreur de chargement");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []); 

    const handleDelete = async(userId) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            try {
                await api.delete(`/users/${userId}`); 
                fetchUsers(search);
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    return (
        <div className="page-wrapper" style={{ backgroundColor: BACKGROUND_COLOR, minHeight: '100vh', padding: '10px' }}>
            <div className="container-card" style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '20px', // Réduit pour gagner de l'espace
                boxShadow: '0 2px 15px rgba(0,0,0,0.03)',
                width: '100%', // Occupe toute la largeur
                margin: '0' // Supprime le centrage forcé avec marges
            }}>
                
                {/* HEADER SECTION */}
                <div style={{ marginBottom: '25px' }}>
                    <h1 style={{ color: PRIMARY_COLOR, fontSize: '1.6rem', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <FaUsers /> Gestion des Utilisateurs
                    </h1>

                    <div className="actions-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'space-between' }}>
                        <form onSubmit={(e) => { e.preventDefault(); fetchUsers(search); }} style={{ display: 'flex', flexGrow: 1, maxWidth: '800px', gap: '8px' }}>
                            <div style={{ position: 'relative', flexGrow: 1 }}>
                                <input 
                                    type="text" 
                                    placeholder="Rechercher par nom ou email..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="search-input"
                                />
                                <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                            </div>
                            <button type="submit" style={{ ...buttonStyle, background: PRIMARY_COLOR, color: 'white' }}>
                                <FaSearch /> <span className="hide-mobile">Rechercher</span>
                            </button>
                        </form>

                        <Link to="/users/add" style={{ textDecoration: 'none' }}>
                            <button style={{ ...buttonStyle, background: SECONDARY_COLOR, color: 'white' }}>
                                <FaPlus /> <span>Nouveau Utilisateur</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: PRIMARY_COLOR }}>Chargement...</div>
                ) : (
                    <>
                        {/* VERSION DESKTOP */}
                        <div className="desktop-view">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #F1F5F9', textAlign: 'left' }}>
                                        <th className="th-style">Utilisateur</th>
                                        <th className="th-style">Contact</th>
                                        <th className="th-style">Rôle</th>
                                        <th className="th-style">Statut</th>
                                        <th className="th-style" style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="table-row">
                                            <td style={{ padding: '12px', fontWeight: '600', color: '#1E293B' }}>
                                                {user.firstName} {user.lastName}
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B' }}>
                                                    <FaEnvelope style={{ color: SECONDARY_COLOR, flexShrink: 0 }} /> {user.email}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                                                    <FaPhone style={{ color: SECONDARY_COLOR, flexShrink: 0 }} /> {user.phoneNumber || 'N/A'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: '600', color: PRIMARY_COLOR }}>
                                                    {user.role?.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={getStatusBadgeStyle(user.isVerified)}>
                                                    {user.isVerified ? 'ACTIF' : 'ATTENTE'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <Link to={`/users/edit/${user.id}`}>
                                                        <button className="action-btn edit"><FaEdit /></button>
                                                    </Link>
                                                    <button onClick={() => handleDelete(user.id)} className="action-btn delete"><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* VERSION MOBILE */}
                        <div className="mobile-view">
                            {users.map(user => (
                                <div key={user.id} className="user-mobile-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <div style={{ fontWeight: '700', color: '#1E293B' }}>{user.firstName} {user.lastName}</div>
                                        <span style={getStatusBadgeStyle(user.isVerified)}>{user.isVerified ? 'ACTIF' : 'ATTENTE'}</span>
                                    </div>
                                    <div className="contact-info-mobile">
                                        <div><FaEnvelope /> {user.email}</div>
                                        <div style={{ marginTop: '5px' }}><FaPhone /> {user.phoneNumber || 'N/A'}</div>
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: SECONDARY_COLOR, marginBottom: '10px' }}>
                                        RÔLE: {user.role?.toUpperCase()}
                                    </div>
                                    <div className="card-actions-mobile">
                                        <Link to={`/users/edit/${user.id}`} style={{ flex: 1 }}>
                                            <button className="mobile-action-btn edit-m"><FaEdit /> Modifier</button>
                                        </Link>
                                        <button onClick={() => handleDelete(user.id)} className="mobile-action-btn delete-m"><FaTrash /> Supprimer</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .th-style { padding: 12px; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; }
                .table-row { border-bottom: 1px solid #F1F5F9; }
                .search-input { 
                    width: 100%; padding: 10px 10px 10px 40px; border-radius: 8px; 
                    border: 1px solid #E2E8F0; font-size: 14px; outline: none;
                }
                .action-btn { padding: 8px; border-radius: 6px; border: none; cursor: pointer; }
                .action-btn.edit { background: #EBF8FF; color: #3182CE; }
                .action-btn.delete { background: #FFF5F5; color: #E53E3E; }

                .mobile-view { display: none; }

                @media (max-width: 850px) {
                    .desktop-view { display: none; }
                    .mobile-view { display: block; }
                    .user-mobile-card {
                        background: #fff; border: 1px solid #EDF2F7; border-radius: 10px; padding: 15px; margin-bottom: 10px;
                    }
                    .contact-info-mobile { font-size: 13px; color: #4A5568; margin-bottom: 10px; background: #F7FAFC; padding: 8px; border-radius: 6px; }
                    .card-actions-mobile { display: flex; gap: 8px; }
                    .mobile-action-btn { flex: 1; padding: 8px; border-radius: 6px; border: none; display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 12px; font-weight: 600; }
                    .edit-m { background: #EBF8FF; color: #3182CE; }
                    .delete-m { background: #FFF5F5; color: #E53E3E; }
                    .hide-mobile { display: none; }
                }
            `}</style>
        </div>
    );
}

export default UsersPage;