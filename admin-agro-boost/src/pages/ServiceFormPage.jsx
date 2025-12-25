import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import { FaCloudUploadAlt, FaMapMarkerAlt, FaTools, FaAlignLeft, FaTimes } from "react-icons/fa";

const PRIMARY_COLOR = '#0070AB';
const SUCCESS_COLOR = '#4CAF50';
const DANGER_COLOR = '#E53E3E';

function ServiceFormPage() {
    const { serviceId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!serviceId;

    const [formData, setFormData] = useState({
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

    useEffect(() => {
        if (isEditMode) {
            const fetchService = async () => {
                try {
                    const res = await api.get(`/services/${serviceId}`);
                    const s = res.data.data || res.data;
                    setFormData({
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
                    if (s.images) setImagesBase64(s.images);
                } catch (err) {
                    console.error("Erreur chargement service:", err);
                }
            };
            fetchService();
        }
    }, [isEditMode, serviceId]);

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
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
        Promise.all(promises).then(newImages => {
            setImagesBase64(prev => [...prev, ...newImages]);
        });
    };

    const removeImage = (index) => {
        setImagesBase64(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.pricePerHour && !formData.pricePerDay) {
            setSubmitError("Veuillez saisir au moins un prix (heure ou jour).");
            return;
        }

        setLoading(true);
        setSubmitError(null);

        let finalLat = formData.latitude;
        let finalLong = formData.longitude;

        try {
            if (formData.locationName) {
                const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.locationName)}`,
                    { headers: { 'User-Agent': 'AgroBoost-App/1.0' } }
                );
                const geoData = await geoRes.json();
                if (geoData && geoData.length > 0) {
                    finalLat = parseFloat(geoData[0].lat);
                    finalLong = parseFloat(geoData[0].lon);
                }
            }
        } catch (err) {
            console.warn("Échec du géocodage.");
        }

        // --- CORRECTION ERREUR VALIDATION ---
        // On extrait "locationName" pour ne PAS l'envoyer au backend car il n'est pas autorisé
        const { locationName, ...restOfData } = formData;

        const payload = {
            ...restOfData,
            pricePerHour: Number(formData.pricePerHour) || 0,
            pricePerDay: Number(formData.pricePerDay) || 0,
            latitude: finalLat,
            longitude: finalLong,
            images: imagesBase64 
        };

        try {
            if (isEditMode) {
                await api.put(`/services/${serviceId}`, payload);
            } else {
                await api.post('/services', payload);
            }
            navigate('/services');
        } catch (err) {
            setSubmitError(err.response?.data?.message || "Erreur lors de l'enregistrement");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 'clamp(10px, 3vw, 40px) 10px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div style={containerStyle}>
                
                <header style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h1 style={{ color: PRIMARY_COLOR, fontSize: '24px', fontWeight: '800' }}>
                        {isEditMode ? '🛠️ Modifier le Service' : '🚜 Nouveau Service Agricole'}
                    </h1>
                    <p style={{color: '#64748b', fontSize: '14px'}}>Remplissez les informations de votre prestation</p>
                </header>

                {submitError && (
                    <div style={errorStyle}>
                        <strong>Oups !</strong> {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    
                    <div className="grid-responsive">
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}><FaTools color={PRIMARY_COLOR}/> Nom du matériel</label>
                            <input type="text" name="name" value={formData.name} onChange={handleFormChange} required style={inputStyle} placeholder="Ex: Tracteur John Deere" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Type d'équipement</label>
                            <select name="serviceType" value={formData.serviceType} onChange={handleFormChange} style={inputStyle}>
                                <option value="tractor">Tracteur</option>
                                <option value="semoir">Semoir</option>
                                <option value="moissonneuse">Moissonneuse</option>
                                <option value="operator">Opérateur / Main d'œuvre</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}><FaMapMarkerAlt color="#ef4444"/> Localisation (Ville)</label>
                        <input type="text" name="locationName" value={formData.locationName} onChange={handleFormChange} required style={inputStyle} placeholder="Ex: Dakar, Thiès, Kaolack..." />
                    </div>

                    <div className="grid-responsive">
                        <div>
                            <label style={labelStyle}>Prix / Heure (FCFA)</label>
                            <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={handleFormChange} style={inputStyle} placeholder="0" />
                        </div>
                        <div>
                            <label style={labelStyle}>Prix / Jour (FCFA)</label>
                            <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleFormChange} style={inputStyle} placeholder="0" />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}><FaAlignLeft color={PRIMARY_COLOR}/> Description</label>
                        <textarea name="description" value={formData.description} onChange={handleFormChange} rows="3" style={{...inputStyle, resize: 'vertical'}} placeholder="Décrivez l'état et les spécificités..."></textarea>
                    </div>

                    {/* Zone d'Upload Photo - CORRIGÉE POUR MOBILE */}
                    <div>
                        <label style={labelStyle}><FaCloudUploadAlt color={PRIMARY_COLOR}/> Photos du matériel</label>
                        <div style={dropzoneStyle}>
                            <input type="file" multiple onChange={handleFileChange} accept="image/*" style={fileInputHidden} />
                            <FaCloudUploadAlt size={32} color={PRIMARY_COLOR} />
                            <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
                                Cliquez ou glissez vos photos ici
                            </p>
                        </div>
                        
                        {/* Prévisualisation - CORRIGÉE POUR MOBILE */}
                        <div style={previewContainerStyle}>
                            {imagesBase64.map((img, i) => (
                                <div key={i} style={previewWrapperStyle}>
                                    <img src={img} alt="preview" style={previewImgStyle} />
                                    <button type="button" onClick={() => removeImage(i)} style={removeBadgeStyle}>
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={footerStyle}>
                        <button type="submit" disabled={loading} style={{ ...btnBase, background: SUCCESS_COLOR, flex: 2 }}>
                            {loading ? '⏳ Enregistrement...' : 'Enregistrer le Service'}
                        </button>
                        <button type="button" onClick={() => navigate('/services')} style={{ ...btnBase, background: '#f1f5f9', color: '#475569', flex: 1 }}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .grid-responsive {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }
                @media (max-width: 600px) {
                    .grid-responsive { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

// Styles Internes - CORRIGÉS
const containerStyle = { 
    backgroundColor: 'white', 
    borderRadius: '20px', 
    padding: 'clamp(15px, 5vw, 40px)', 
    maxWidth: '850px', 
    margin: '0 auto', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
    boxSizing: 'border-box'
};

const inputStyle = { width: '100%', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none', fontSize: '15px', boxSizing: 'border-box' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '8px' };
const errorStyle = { background: '#fef2f2', color: '#991b1b', padding: '15px', borderRadius: '12px', marginBottom: '25px', border: '1px solid #fee2e2', fontSize: '14px' };

// Correction Dropzone (boxSizing + padding)
const dropzoneStyle = { 
    position: 'relative', 
    width: '100%', 
    padding: '20px', 
    border: '2px dashed #cbd5e1', 
    borderRadius: '15px', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    backgroundColor: '#f8fafc', 
    transition: 'all 0.2s',
    boxSizing: 'border-box'
};

const fileInputHidden = { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' };

// Correction Preview Container (Flex Wrap)
const previewContainerStyle = { 
    display: 'flex', 
    gap: '12px', 
    marginTop: '15px', 
    flexWrap: 'wrap',
    justifyContent: 'flex-start' 
};

const previewWrapperStyle = { 
    position: 'relative', 
    width: 'clamp(70px, 20vw, 80px)', 
    height: 'clamp(70px, 20vw, 80px)' 
};

const previewImgStyle = { width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0' };

const removeBadgeStyle = { 
    position: 'absolute', 
    top: '-5px', 
    right: '-5px', 
    width: '22px', 
    height: '22px', 
    borderRadius: '50%', 
    backgroundColor: DANGER_COLOR, 
    color: 'white', 
    border: '2px solid white', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 2
};

const btnBase = { padding: '16px', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.1s active', color: 'white', fontSize: '14px' };
const footerStyle = { display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' };

export default ServiceFormPage;