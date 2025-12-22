import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { FaCloudUploadAlt, FaMapMarkerAlt, FaUserTie, FaTools, FaAlignLeft } from "react-icons/fa";

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';

const modernInputStyle = {
    width: '100%', 
    padding: '12px 15px', 
    border: '1px solid #ddd', 
    borderRadius: '8px', 
    outline: 'none',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit'
};

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px', 
    fontWeight: '600', 
    color: '#4A5568', 
    marginBottom: '8px'
};

function ServiceFormPage() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!serviceId;

    const [providers, setProviders] = useState([]);
    const [formData, setFormData] = useState({
        providerId: '', 
        name: '',
        serviceType: 'tractor', 
        description: '',
        pricePerHour: '', 
        pricePerDay: '',
        locationName: '', 
        latitude: 14.7167, 
        longitude: -17.4677,
        availability: true
    });
    
    const [imagesBase64, setImagesBase64] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // 1. Charger les prestataires
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await api.get('/users?role=provider');
                const rawData = response.data.data || response.data;
                if (Array.isArray(rawData)) setProviders(rawData);
            } catch (err) {
                console.error("Erreur API prestataires:", err);
            }
        };
        fetchProviders();
    }, []);

    // 2. Charger les données en mode édition
    useEffect(() => {
        if (isEditMode) {
            const fetchService = async () => {
                try {
                    const res = await api.get(`/services/${serviceId}`);
                    const s = res.data.data || res.data;
                    setFormData({
                        providerId: s.providerId?._id || s.providerId || '',
                        name: s.name || '',
                        serviceType: s.serviceType || 'tractor',
                        description: s.description || '',
                        pricePerHour: s.pricePerHour || '',
                        pricePerDay: s.pricePerDay || '',
                        locationName: s.locationName || '',
                        latitude: s.latitude || 14.7167,
                        longitude: s.longitude || -17.4677,
                        availability: s.availability ?? true
                    });
                } catch (err) {
                    console.error("Erreur chargement service:", err);
                }
            };
            fetchService();
        }
    }, [isEditMode, serviceId]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const promises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });
        Promise.all(promises).then(base64Strings => {
            setImagesBase64(base64Strings);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSubmitError(null);

        // Variables temporaires pour stocker les coordonnées finales
        let finalLat = formData.latitude;
        let finalLong = formData.longitude;

        //  CALCUL DES COORDONNÉES AU MOMENT DE L'ENREGISTREMENT 
        try {
            const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.locationName)}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'AgroBoost-Dakar-App/1.0' // Header pour éviter l'erreur 403
                    }
                }
            );
            const geoData = await geoRes.json();
            if (geoData && geoData.length > 0) {
                finalLat = parseFloat(geoData[0].lat);
                finalLong = parseFloat(geoData[0].lon);
            }
        } catch (err) {
            console.warn("Échec du géocodage Nominatim, utilisation des valeurs par défaut.");
        }

        // Construction du payload avec les coordonnées calculées
        const payload = {
            name: formData.name,
            serviceType: formData.serviceType,
            description: formData.description,
            pricePerHour: Number(formData.pricePerHour) || 0,
            pricePerDay: Number(formData.pricePerDay) || 0,
            availability: formData.availability,
            latitude: finalLat,
            longitude: finalLong,
            images: imagesBase64 
        };

        try {
            if (isEditMode) {
                await api.put(`/services/${serviceId}`, payload);
            } else {
                const createData = { ...payload, providerId: formData.providerId };
                await api.post('/services', createData);
            }
            alert("Enregistré avec succès !");
            navigate('/services');
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px 20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '40px', maxWidth: '850px', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                
                <header style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h1 style={{ color: PRIMARY_COLOR, fontSize: '24px', fontWeight: 'bold' }}>
                        {isEditMode ? '🛠️ Modifier le Service' : '🚜 Nouveau Service Agricole'}
                    </h1>
                </header>

                {submitError && (
                    <div style={{ background: '#FFF5F5', color: '#C53030', padding: '15px', borderRadius: '8px', marginBottom: '25px', borderLeft: '5px solid #C53030' }}>
                        ⚠️ {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
                    
                    {/* SÉLECTION PRESTATAIRE */}
                    <div>
                        <label style={labelStyle}><FaUserTie color={PRIMARY_COLOR}/> Prestataire (Propriétaire du matériel)</label>
                        <select name="providerId" value={formData.providerId} onChange={handleFormChange} required style={modernInputStyle}>
                            <option value="">-- Choisir le prestataire responsable --</option>
                            {providers.map(p => (
                                <option key={p._id} value={p._id}>
                                    {(p.fullName || p.email).toUpperCase()} {p.businessName ? `(${p.businessName})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <label style={labelStyle}><FaTools color={PRIMARY_COLOR}/> Nom du matériel</label>
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} required style={modernInputStyle} placeholder="Ex: Tracteur John Deere" />
                        </div>
                        <div>
                            <label style={labelStyle}>Type d'équipement</label>
                            <select name="serviceType" value={formData.serviceType} onChange={handleFormChange} style={modernInputStyle}>
                                <option value="tractor">Tracteur</option>
                                <option value="semoir">Semoir</option>
                                <option value="moissonneuse">Moissonneuse</option>
                                <option value="operator">Main d'œuvre</option>
                            </select>
                        </div>
                    </div>

                    {/* LOCALISATION */}
                    <div>
                        <label style={labelStyle}><FaMapMarkerAlt color="#E53E3E"/> Localisation d'intervention</label>
                        <input 
                            type="text" 
                            name="locationName" 
                            value={formData.locationName} 
                            onChange={handleFormChange} 
                            required 
                            style={modernInputStyle} 
                            placeholder="Ex: Dakar, Thiès, Kaolack..." 
                        />
                        <p style={{ fontSize: '11px', color: '#718096', marginTop: '5px', fontStyle: 'italic' }}>
                            Les coordonnées GPS seront automatiquement extraites à partir de ce nom lors de l'enregistrement.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                        <div>
                            <label style={labelStyle}>Prix / Heure (FCFA)</label>
                            <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleFormChange} style={modernInputStyle} placeholder="0" />
                        </div>
                        <div>
                            <label style={labelStyle}>Prix / Jour (FCFA)</label>
                            <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleFormChange} style={modernInputStyle} placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}><FaAlignLeft color={PRIMARY_COLOR}/> Description</label>
                        <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" style={{...modernInputStyle, resize: 'vertical'}} placeholder="Détails techniques..."></textarea>
                    </div>

                    {/* UPLOAD IMAGES */}
                    <div>
                        <label style={labelStyle}><FaCloudUploadAlt color={PRIMARY_COLOR}/> Photos</label>
                        <div style={{ 
                            position: 'relative', width: '100%', height: '100px', 
                            border: '2px dashed #CBD5E0', borderRadius: '12px', 
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7FAFC'
                        }}>
                            <input type="file" multiple onChange={handleFileChange} accept="image/*" style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                            <FaCloudUploadAlt size={30} color={PRIMARY_COLOR} />
                            <p style={{ margin: 0, fontSize: '13px', color: '#4A5568' }}>
                                {imagesBase64.length > 0 ? `${imagesBase64.length} photo(s) sélectionnée(s)` : "Ajouter des images"}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                            {imagesBase64.map((img, i) => (
                                <img key={i} src={img} alt="preview" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #ddd' }} />
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
                        <button type="submit" disabled={loading} style={{ padding: '15px', background: SUCCESS_COLOR, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                            {loading ? '⏳ Enregistrement...' : 'Enregistrer le Service'}
                        </button>
                        <button type="button" onClick={() => navigate('/services')} style={{ padding: '15px', background: '#EDF2F7', color: '#4A5568', borderRadius: '10px', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ServiceFormPage;