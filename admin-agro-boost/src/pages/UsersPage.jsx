import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { FaUsers, FaSearch, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope } from "react-icons/fa";

// Styles Constants
const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';

const buttonStyle = {
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
};

const getStatusBadgeStyle = (isVerified) => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    color: isVerified ? '#0F6B4E' : '#9A3412',
    backgroundColor: isVerified ? '#E6FFFA' : '#FFFBEB',
    border: `1px solid ${isVerified ? '#B2F5EA' : '#FEF3C7'}`,
});

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    const fetchUsers = async (page = 1, searchQuery = '') => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/users`, {
                params: { page: page, limit: 10, search: searchQuery }
            });
            const { data: fetchedUsers, pagination } = response.data;
            setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []); 
            setTotalPages(pagination?.totalPages || 1);
            setCurrentPage(pagination?.page || page);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur de connexion au serveur.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []); 

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, search); 
    };

    const handleDelete = async(userId) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
            try {
                await api.delete(`/users/${userId}`); 
                fetchUsers(currentPage, search);
            } catch (err) {
                alert("Erreur lors de la suppression.");
            }
        }
    };

    return (
        <div style={{ padding: 'clamp(10px, 3vw, 25px)', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                padding: 'clamp(15px, 4vw, 30px)', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' 
            }}>
                
                {/* --- HEADER --- */}
                <div style={{ marginBottom: '30px' }}>
                    <h1 style={{ 
                        color: PRIMARY_COLOR, 
                        fontSize: 'clamp(1.4rem, 5vw, 2rem)', 
                        margin: '0 0 20px 0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px' 
                    }}>
                        <FaUsers /> Gestion des Utilisateurs
                    </h1>

                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '12px', 
                        justifyContent: 'space-between' 
                    }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', flexGrow: 1, maxWidth: '600px', gap: '8px' }}>
                            <div style={{ position: 'relative', flexGrow: 1 }}>
                                <input 
                                    type="text" 
                                    placeholder="Rechercher..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{ 
                                        width: '100%',
                                        padding: '12px 12px 12px 40px', 
                                        borderRadius: '10px', 
                                        border: '1px solid #e2e8f0',
                                        fontSize: '15px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            </div>
                            <button type="submit" style={{ ...buttonStyle, background: PRIMARY_COLOR, color: 'white' }}>
                                <span className="hide-mobile">Rechercher</span>
                            </button>
                        </form>

                        <Link to="/users/add" style={{ textDecoration: 'none', width: 'auto' }}>
                            <button style={{ ...buttonStyle, background: SUCCESS_COLOR, color: 'white', width: '100%' }}>
                                <FaPlus /> <span className="hide-mobile">Ajouter</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* --- CONTENU --- */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Chargement...</div>
                ) : error ? (
                    <div style={{ color: '#e53e3e', textAlign: 'center', padding: '20px', backgroundColor: '#fff5f5', borderRadius: '8px' }}>⚠️ {error}</div>
                ) : (
                    <>
                        {/* VERSION DESKTOP (Tableau) */}
                        <div className="hide-mobile">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                                        <th style={{ padding: '15px', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' }}>Utilisateur</th>
                                        <th style={{ padding: '15px', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' }}>Contact</th>
                                        <th style={{ padding: '15px', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' }}>Rôle</th>
                                        <th style={{ padding: '15px', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' }}>Statut</th>
                                        <th style={{ padding: '15px', textAlign: 'right', color: '#64748b', fontSize: '13px', textTransform: 'uppercase' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '15px', fontWeight: '600', color: '#1e293b' }}>{user.firstName} {user.lastName}</td>
                                            <td style={{ padding: '15px', fontSize: '13px', color: '#475569' }}>
                                                <div><FaEnvelope size={10} /> {user.email}</div>
                                                <div><FaPhone size={10} /> {user.phoneNumber || 'N/A'}</div>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={{ fontSize: '12px', color: user.role === 'admin' ? PRIMARY_COLOR : '#64748b', fontWeight: '700' }}>
                                                    {user.role?.toUpperCase() || 'USER'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px' }}>
                                                <span style={getStatusBadgeStyle(user.isVerified)}>
                                                    {user.isVerified ? 'ACTIF' : 'EN ATTENTE'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <Link to={`/users/edit/${user.id}`}>
                                                        <button style={{ ...buttonStyle, padding: '8px', background: '#f0f9ff', color: PRIMARY_COLOR }} title="Modifier">
                                                            <FaEdit />
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => handleDelete(user.id)} style={{ ...buttonStyle, padding: '8px', background: '#fef2f2', color: '#ef4444' }} title="Supprimer">
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* VERSION MOBILE (Cards) */}
                        <div className="show-only-mobile">
                            {users.map(user => (
                                <div key={user.id} style={{ 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '12px', 
                                    padding: '16px', 
                                    marginBottom: '12px',
                                    backgroundColor: '#fff' 
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>{user.firstName} {user.lastName}</div>
                                            <div style={{ fontSize: '12px', color: PRIMARY_COLOR, fontWeight: 'bold' }}>{user.role?.toUpperCase() || 'USER'}</div>
                                        </div>
                                        <span style={getStatusBadgeStyle(user.isVerified)}>{user.isVerified ? 'ACTIF' : 'EN ATTENTE'}</span>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#475569', marginBottom: '15px', lineHeight: '1.6' }}>
                                        <div><FaEnvelope style={{ marginRight: '8px' }} /> {user.email}</div>
                                        <div><FaPhone style={{ marginRight: '8px' }} /> {user.phoneNumber || 'N/A'}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                        <Link to={`/users/edit/${user.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                            <button style={{ ...buttonStyle, width: '100%', background: '#f0f9ff', color: PRIMARY_COLOR }}>
                                                <FaEdit /> Modifier
                                            </button>
                                        </Link>
                                        <button onClick={() => handleDelete(user.id)} style={{ ...buttonStyle, flex: 1, background: '#fef2f2', color: '#ef4444' }}>
                                            <FaTrash /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* --- PAGINATION --- */}
                {!loading && users.length > 0 && (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '15px',
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid #f1f5f9'
                    }}>
                        <div style={{ fontSize: '14px', color: '#64748b' }}>
                            Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                            <button 
                                disabled={currentPage === 1}
                                onClick={() => fetchUsers(currentPage - 1, search)}
                                style={{ ...buttonStyle, background: '#f1f5f9', color: '#475569', flex: 1, maxWidth: '120px' }}
                            >
                                Précédent
                            </button>
                            <button 
                                disabled={currentPage === totalPages}
                                onClick={() => fetchUsers(currentPage + 1, search)}
                                style={{ ...buttonStyle, background: '#f1f5f9', color: '#475569', flex: 1, maxWidth: '120px' }}
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>
                {`
                    .show-only-mobile { display: none; }
                    .table-row:hover { background-color: #f8fafc; }
                    
                    @media (max-width: 768px) {
                        .hide-mobile { display: none; }
                        .show-only-mobile { display: block; }
                        button { font-size: 14px; }
                    }

                    @media (max-width: 480px) {
                        .header-actions { flex-direction: column; }
                    }
                `}
            </style>
        </div>
    );
}

export default UsersPage;