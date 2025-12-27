import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { FaUsers, FaSearch, FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope, FaBell, FaUserCircle } from "react-icons/fa";

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
        /* responsive-container : Padding réduit à 0 sur mobile pour occuper tout l'espace */
        <div className="responsive-container" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            
            {/* LA BARRE HAUTE A ÉTÉ SUPPRIMÉE ICI POUR ÉVITER LE DOUBLON AVEC TON LAYOUT GLOBAL */}

            <div className="main-content-card" style={{ 
                backgroundColor: 'white', 
                borderRadius: '16px', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' 
            }}>
                
                {/* HEADER TITRE ET RECHERCHE */}
                <div style={{ marginBottom: '20px' }}>
                    <h1 style={{ 
                        color: PRIMARY_COLOR, 
                        fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', 
                        margin: '0 0 15px 0', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px' 
                    }}>
                        <FaUsers /> Gestion des Utilisateurs
                    </h1>

                    <div style={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '10px', 
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
                                        padding: '10px 10px 10px 35px', 
                                        borderRadius: '10px', 
                                        border: '1px solid #e2e8f0',
                                        fontSize: '15px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            </div>
                            <button type="submit" style={{ ...buttonStyle, background: PRIMARY_COLOR, color: 'white' }}>
                                <span className="hide-mobile">Rechercher</span>
                                <FaSearch className="show-only-mobile" />
                            </button>
                        </form>

                        <Link to="/users/add" style={{ textDecoration: 'none' }}>
                            <button style={{ ...buttonStyle, background: SUCCESS_COLOR, color: 'white' }}>
                                <FaPlus /> <span className="hide-mobile">Ajouter</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* CONTENU */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '30px' }}>Chargement...</div>
                ) : error ? (
                    <div style={{ color: '#e53e3e', textAlign: 'center', padding: '20px', backgroundColor: '#fff5f5', borderRadius: '8px' }}>⚠️ {error}</div>
                ) : (
                    <>
                        {/* VERSION DESKTOP */}
                        <div className="hide-mobile">
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                                        <th style={{ padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Utilisateur</th>
                                        <th style={{ padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Contact</th>
                                        <th style={{ padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Rôle</th>
                                        <th style={{ padding: '12px', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Statut</th>
                                        <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="table-row" style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px', fontWeight: '600' }}>{user.firstName} {user.lastName}</td>
                                            <td style={{ padding: '12px', fontSize: '13px' }}>
                                                <div><FaEnvelope size={10} /> {user.email}</div>
                                                <div><FaPhone size={10} /> {user.phoneNumber || 'N/A'}</div>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{ fontSize: '12px', color: user.role === 'admin' ? PRIMARY_COLOR : '#64748b', fontWeight: '700' }}>
                                                    {user.role?.toUpperCase() || 'USER'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={getStatusBadgeStyle(user.isVerified)}>
                                                    {user.isVerified ? 'ACTIF' : 'EN ATTENTE'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <Link to={`/users/edit/${user.id}`}>
                                                        <button style={{ ...buttonStyle, padding: '6px', background: '#f0f9ff', color: PRIMARY_COLOR }}><FaEdit /></button>
                                                    </Link>
                                                    <button onClick={() => handleDelete(user.id)} style={{ ...buttonStyle, padding: '6px', background: '#fef2f2', color: '#ef4444' }}><FaTrash /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                   {/* VERSION MOBILE */}
                <div className="show-only-mobile">
                    {users.map(user => (
                        <div key={user.id} style={{ 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '12px', 
                            padding: '12px', 
                            marginBottom: '12px',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                            {/* Ligne 1: Nom et Statut */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#1e293b', lineHeight: '1.2' }}>
                                        {user.firstName} {user.lastName}
                                    </div>
                                    <div style={{ fontSize: '11px', color: PRIMARY_COLOR, fontWeight: 'bold', marginTop: '2px' }}>
                                        {user.role?.toUpperCase() || 'USER'}
                                    </div>
                                </div>
                                {/* Ajustement du Badge pour éviter le texte coupé */}
                                <div style={{ flexShrink: 0 }}>
                                    <span style={{ 
                                        ...getStatusBadgeStyle(user.isVerified), 
                                        whiteSpace: 'nowrap', // Empêche le texte de revenir à la ligne
                                        fontSize: '10px',
                                        padding: '4px 8px' 
                                    }}>
                                        {user.isVerified ? 'ACTIF' : 'EN ATTENTE'}
                                    </span>
                                </div>
                            </div>

                            {/* Ligne 2: Contacts (Email et Téléphone) */}
                            <div style={{ 
                                fontSize: '13px', 
                                color: '#475569', 
                                marginBottom: '12px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '5px',
                                backgroundColor: '#f8fafc',
                                padding: '8px',
                                borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowWrap: 'anywhere' }}>
                                    <FaEnvelope size={12} style={{ color: '#94a3b8', shrink: 0 }} /> 
                                    <span style={{ wordBreak: 'break-all' }}>{user.email}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <FaPhone size={12} style={{ color: '#94a3b8', shrink: 0 }} /> 
                                    <span>{user.phoneNumber || 'Pas de numéro'}</span>
                                </div>
                            </div>

                            {/* Ligne 3: Actions */}
                            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                                <Link to={`/users/edit/${user.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                                    <button style={{ ...buttonStyle, width: '100%', padding: '10px', background: '#f0f9ff', color: PRIMARY_COLOR, fontSize: '12px' }}>
                                        <FaEdit /> Modifier
                                    </button>
                                </Link>
                                <button onClick={() => handleDelete(user.id)} style={{ ...buttonStyle, flex: 1, padding: '10px', background: '#fef2f2', color: '#ef4444', fontSize: '12px' }}>
                                    <FaTrash /> Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                </>
            )}
            </div>

            <style>
                {`
                    .responsive-container { padding: 20px; }
                    .main-content-card { padding: 25px; }
                    .show-only-mobile { display: none; }
                    .table-row:hover { background-color: #f8fafc; }
                    
                    @media (max-width: 768px) {
                        /* On élimine les paddings pour que le contenu touche presque les bords */
                        .responsive-container { padding: 4px; } 
                        .main-content-card { padding: 10px; border-radius: 8px; width: 100%; box-sizing: border-box; }
                        .hide-mobile { display: none; }
                        .show-only-mobile { display: block; }
                    }
                `}
            </style>
        </div>
    );
}

export default UsersPage;