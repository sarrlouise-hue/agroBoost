/**
 * Résout la position à afficher sur la carte pour une machine.
 *
 * Le vrai géocodage se fait déjà côté BACKEND (Nominatim / OpenStreetMap) :
 * - à la création d'une machine (service.service.js → createService)
 * - à la modification d'une machine (service.service.js → updateService)
 * - pour les machines déjà existantes, via le script de rattrapage
 *   `backend/scripts/backfill-service-coordinates.js`
 *
 * Donc dans l'immense majorité des cas, `latitude`/`longitude` sont déjà
 * les vraies coordonnées GPS de la zone tapée par le prestataire (ex: "Dakar"
 * → les vraies coordonnées de Dakar), et cette fonction se contente de les
 * utiliser telles quelles.
 *
 * Le secours ci-dessous ne sert que si, pour une raison ou une autre, une
 * machine n'a vraiment aucune coordonnée (ex: backfill pas encore lancé,
 * ou géocodage qui a échoué pour un texte non reconnu par Nominatim) : dans
 * ce cas on génère quand même une position stable (toujours la même pour
 * une machine donnée) pour ne jamais laisser un pin absent de la carte.
 */

// Zones de secours (uniquement si aucune coordonnée réelle n'est disponible)
const FALLBACK_ZONES: { name: string; lat: number; lng: number }[] = [
	{ name: "Thiès", lat: 14.7910, lng: -16.9256 },
	{ name: "Pout", lat: 14.7725, lng: -17.0603 },
	{ name: "Mbour", lat: 14.4198, lng: -16.9646 },
	{ name: "Tivaouane", lat: 14.9500, lng: -16.8167 },
	{ name: "Kaolack", lat: 14.1652, lng: -16.0728 },
	{ name: "Diourbel", lat: 14.6559, lng: -16.2314 },
	{ name: "Fatick", lat: 14.3390, lng: -16.4110 },
	{ name: "Louga", lat: 15.6144, lng: -16.2258 },
];

/** Hash simple et déterministe d'une chaîne vers un entier positif */
function hashString(value: string): number {
	let hash = 0;
	for (let i = 0; i < value.length; i++) {
		hash = (hash << 5) - hash + value.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

export interface ResolvedLocation {
	latitude: number;
	longitude: number;
	zoneName: string;
	isSimulated: boolean;
}

export function resolveMachineLocation(
	id: string,
	latitude?: number | null,
	longitude?: number | null,
	locationLabel?: string | null
): ResolvedLocation {
	// Cas normal : le backend a déjà géocodé la vraie position (Nominatim)
	if (
		typeof latitude === "number" &&
		typeof longitude === "number" &&
		!Number.isNaN(latitude) &&
		!Number.isNaN(longitude)
	) {
		return {
			latitude,
			longitude,
			zoneName: locationLabel || "Position GPS",
			isSimulated: false,
		};
	}

	// Secours : aucune coordonnée en base, on génère une position stable
	// pour ne jamais laisser un pin absent de la carte.
	const hash = hashString(id);
	const zone = FALLBACK_ZONES[hash % FALLBACK_ZONES.length];
	const jitterLat = (((hash >> 3) % 1000) / 1000 - 0.5) * 0.1;
	const jitterLng = (((hash >> 7) % 1000) / 1000 - 0.5) * 0.1;

	return {
		latitude: zone.lat + jitterLat,
		longitude: zone.lng + jitterLng,
		zoneName: locationLabel || zone.name,
		isSimulated: true,
	};
}