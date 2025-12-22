import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { FaUsers, FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

// Styles Constants (Bleu et Vert pour le thème Agro)
const PRIMARY_COLOR = '#0070AB'; // Bleu
const SUCCESS_COLOR = '#4CAF50'; // Vert

// Style pour les boutons modernes
const buttonStyle = {
    padding: '10px 18px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'background-color 0.2s',
};

// Style pour les champs de formulaire modernes (recherche)
const inputStyle = {
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
    width: '300px', // Largeur fixe pour la recherche
    outline: 'none',
    marginRight: '10px',
};

// Style pour les badges de statut
const getStatusBadgeStyle = (isVerified) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: isVerified ? '#0F6B4E' : '#9A3412',
    backgroundColor: isVerified ? '#E6FFFA' : '#FEFCBF',
});

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Paramètres de pagination et recherche
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    
    // Ajouté pour gérer l'état d'une recherche sans résultat distincte du chargement
    const [searchPerformed, setSearchPerformed] = useState(false); 
    
    const columns = ['Nom Complet', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Actions']; 

    const fetchUsers = async (page = 1, searchQuery = '') => {
        setLoading(true);
        setError(null);
        try {
            // Requête pour la liste (GET /api/users) 
            const response = await api.get(`/users`, {
                params: { page: page, limit: 10, search: searchQuery }
            });
            
            const { data: fetchedUsers, pagination } = response.data;
            
            const filteredUsers = Array.isArray(fetchedUsers) ? fetchedUsers : [];
            setUsers(filteredUsers); 

            setTotalPages(pagination?.totalPages || 1);
            setCurrentPage(pagination?.page || page);
            
            setSearchPerformed(searchQuery.trim() !== '');

        } catch (err) {
            console.error("Erreur lors de la récupération des utilisateurs:", err.response || err);
            // Amélioration du message d'erreur pour aider au debug
            const errorMessage = err.response?.status === 404 && err.response?.config?.url.includes('/users')
                ? "API backend : La route /users n'est pas trouvée (pour la liste). Vérifiez la configuration du serveur."
                : err.response?.data?.message || "Impossible de charger la liste des utilisateurs.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []); 

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, search); 
    };
    
    const handlePageChange = (newPage) => {
        fetchUsers(newPage, search);
    };

    const handleDelete = async(userId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            try{
                // Requête de suppression (DELETE /api/users/{id}) 
                await api.delete(`/users/${userId}`); 
                
                // Recharger les données après suppression
                fetchUsers(currentPage, search);
                console.log(`Suppression de l'utilisateur ID: ${userId} réussie.`);
            }catch (err){
                console.error("Erreur lors de la suppression:", err.response || err);
                const errorMessage = err.response?.data?.message || "Échec de la suppression. Vérifiez la route de votre API.";
                setError(errorMessage);
            }
        }
    };

    return (
        <div 
            style={{ 
                padding: 0, 
                backgroundColor: 'transparent', 
                width: '100%', 
                minHeight: '100vh' 
            }}
        >
            <div style={{ padding: '20px', backgroundColor: 'white' }}>

                <h1 style={{ color: PRIMARY_COLOR, borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FaUsers size={28} style={{ color: PRIMARY_COLOR }} />
                    Gestion des Utilisateurs
                </h1>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                            type="text" 
                            placeholder="Rechercher par nom ou email..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={inputStyle}
                        />
                        <button 
                            type="submit" 
                            style={{ ...buttonStyle, background: PRIMARY_COLOR, color: 'white' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#005a8f'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                        >
                            <FaSearch style={{ marginRight: '6px' }} /> Rechercher
                        </button>
                    </form>
                    <Link to="/users/add">
                        <button 
                            style={{ ...buttonStyle, background: SUCCESS_COLOR, color: 'white' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3e8e41'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = SUCCESS_COLOR}
                        >
                            <FaPlus style={{ marginRight: '6px' }} /> Ajouter Utilisateur
                        </button>
                    </Link>
                </div>
                
                {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Chargement de la liste des utilisateurs...</p>}
                {error && <p style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
                    ⚠️ Erreur API : {error}
                </p>}

                {!loading && !error && users.length > 0 && (
                    <>
                        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #eee' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f4f7f9' }}>
                                        {columns.map(col => (
                                            <th 
                                                key={col} 
                                                style={{ 
                                                    padding: '12px 15px', 
                                                    textAlign: 'left', 
                                                    fontSize: '14px', 
                                                    color: '#333', 
                                                    fontWeight: '700' 
                                                }}
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr 
                                            key={user.id} 
                                            style={{ borderBottom: '1px solid #f0f0f0' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
                                        >
                                            <td style={{ padding: '12px 15px', fontWeight: '500' }}>{user.firstName} {user.lastName}</td>
                                            <td style={{ padding: '12px 15px' }}>{user.email}</td>
                                            <td style={{ padding: '12px 15px' }}>{user.phoneNumber || '-'}</td>
                                            <td style={{ padding: '12px 15px' }}>
                                                <span style={{ 
                                                    padding: '4px 8px', 
                                                    borderRadius: '4px', 
                                                    backgroundColor: user.role === 'admin' ? PRIMARY_COLOR : '#eee',
                                                    color: user.role === 'admin' ? 'white' : '#333',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                }}>
                                                    {user.role || 'Producteur'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 15px' }}>
                                                <span style={getStatusBadgeStyle(user.isVerified)}>
                                                    {user.isVerified ? 'Actif' : 'En attente'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 15px' }}>
                                                <div style={{ display: 'flex', gap: '8px' }}> 
                                                    {/* Ce lien déclenche l'appel 404  */}
                                                    <Link to={`/users/edit/${user.id}`}>
                                                        <button 
                                                            style={{ ...buttonStyle, padding: '6px 10px', background: PRIMARY_COLOR, color: 'white', fontSize: '12px' }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#005a8f'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PRIMARY_COLOR}
                                                        >
                                                            <FaEdit style={{ marginRight: '4px' }} /> Modifier
                                                        </button>
                                                    </Link>
                                                    <button 
                                                        style={{ ...buttonStyle, padding: '6px 10px', background: '#e53e3e', color: 'white', fontSize: '12px' }} 
                                                        onClick={() => handleDelete(user.id)}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c53030'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
                                                    >
                                                        <FaTrash style={{ marginRight: '4px' }} /> Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '30px', fontSize: '14px' }}>
                            <span style={{ marginRight: '15px', color: '#555' }}>Page **{currentPage}** sur **{totalPages}**</span>
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1}
                                style={{ 
                                    ...buttonStyle, 
                                    background: '#eee', 
                                    color: '#333', 
                                    padding: '8px 12px',
                                    marginRight: '10px'
                                }}
                            >
                                ← Précédent
                            </button>
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                style={{ 
                                    ...buttonStyle, 
                                    background: '#eee', 
                                    color: '#333',
                                    padding: '8px 12px',
                                }}
                            >
                                Suivant →
                            </button>
                        </div>
                    </>
                )}
                
                {!loading && !error && users.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#555' }}>
                        {searchPerformed ? `Aucun utilisateur trouvé pour la recherche "${search}".` : 'Aucun utilisateur n\'a été trouvé.'}
                    </p>
                )}
            </div>
        </div>
    );
}

export default UsersPage;