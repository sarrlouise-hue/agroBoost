import React, { useState } from 'react';
import api from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import { FiTruck } from 'react-icons/fi'; 

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f7f9', 
    },
    card: {
        width: '400px',
        padding: '50px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    logo: {
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: '#006633', 
        marginBottom: '30px',
    },
    input: { 
        width: '100%',
        padding: '12px',
        margin: '5px 0 15px 0', 
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
    labelContainer: { 
        textAlign: 'left',
        marginBottom: '10px',
        // MODIFICATION ICI
        fontWeight: 'bold', 
        fontSize: '14px',  
        color: '#333',      
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#4CAF50', 
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    iconCircleStyle: {
        width: '160px', 
        height: '160px',
        borderRadius: '50%', 
        backgroundColor: '#E8F5E9', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0 auto 20px auto', 
    },
};

function LoginPage() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); 

        try {
            const response = await api.post('/auth/login', { 
                phoneNumber: phone, 
                password 
            });

            const token = response.data.data.token;
            if (!token) throw new Error("Token de connexion non reçu.");
            
            localStorage.setItem('agroboost_admin_token', token);
            localStorage.setItem('agroboost_user_data', JSON.stringify(response.data.data.user));
            navigate('/', { replace: true });

        } catch (err) {
            setError(err.response?.data?.message || "Identifiants incorrects.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}>ALLOTRACTEUR Admin</div>
                
                <div style={styles.iconCircleStyle}>
                  <FiTruck size={80} color="#4CAF50" />
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <p style={{ color: 'red', fontSize: '13px', marginBottom: '15px'}}>
                            ⚠️ {error}
                        </p>
                    )}

                    <div style={styles.labelContainer}>
                        <label>Numéro de Téléphone</label>
                        <input
                            type="tel"
                            placeholder="Ex: 77XXXXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.labelContainer}>
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Connexion en cours...' : 'SE CONNECTER'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;