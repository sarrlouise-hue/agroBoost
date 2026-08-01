export type Language = "fr" | "en" | "wo" | "ff";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
	{ code: "fr", label: "Français", flag: "🇫🇷" },
	{ code: "en", label: "English", flag: "🇬🇧" },
	{ code: "wo", label: "Wolof", flag: "🇸🇳" },
	{ code: "ff", label: "Pular", flag: "🇸🇳" },
];

export const DEFAULT_LANGUAGE: Language = "fr";

/**
 * Dictionnaire de traduction. Les clés sont regroupées par section
 * (nav, hero, map, common...) pour rester lisibles.
 *
 * Note: les traductions Wolof et Pular couvrent les textes courts et
 * fréquents de l'interface (menus, boutons, libellés). Pour un produit en
 * production, il est recommandé de les faire relire par un locuteur natif
 * avant publication, en particulier pour les phrases plus longues.
 */
export const translations: Record<Language, Record<string, string>> = {
	fr: {
		// Navigation
		"nav.home": "Accueil",
		"nav.services": "Services",
		"nav.map": "Carte",
		"nav.login": "Connexion",
		"nav.register": "S'inscrire",
		"nav.dashboard": "Tableau de bord",
		"nav.logout": "Déconnexion",

		// Hero (page d'accueil)
		"hero.badge": "Plateforme N° 1 au Sénégal",
		"hero.title": "Louez du matériel agricole",
		"hero.titleHighlight": "en toute simplicité",
		"hero.subtitle": "La première place de marché pour l'agriculture au Sénégal",
		"hero.search": "Rechercher du matériel",
		"hero.becomeProvider": "Devenir prestataire",

		// Carte en direct
		"map.title": "Carte en direct",
		"map.subtitle": "Localisation des machines disponibles au Sénégal",
		"map.machinesCount": "Machines",
		"map.selectHint": "Clique sur une machine pour la localiser",
		"map.available": "Disponible",
		"map.unavailable": "Indisponible",
		"map.short.available": "Dispo",
		"map.short.unavailable": "Occupé",
		"map.estimatedPosition": "Position estimée",
		"map.gpsPosition": "Position GPS",
		"map.viewDetails": "Voir les détails",
		"map.loading": "Chargement de la carte...",
		"map.noMachines": "Aucune machine à afficher pour le moment.",
		"map.zone": "Zone",
		"map.perDay": "CFA / jour",
		"map.recenter": "Recentrer la carte",
		"map.disclaimer":
			"Les positions marquées « estimée » sont générées automatiquement en attendant l'intégration d'un GPS embarqué sur chaque machine.",

		// Commun
		"common.error.loadMachines": "Impossible de charger les machines pour le moment.",
	},

	en: {
		"nav.home": "Home",
		"nav.services": "Services",
		"nav.map": "Map",
		"nav.login": "Log in",
		"nav.register": "Sign up",
		"nav.dashboard": "Dashboard",
		"nav.logout": "Log out",

		"hero.badge": "Senegal's #1 Platform",
		"hero.title": "Rent farm equipment",
		"hero.titleHighlight": "with total ease",
		"hero.subtitle": "The first marketplace for agriculture in Senegal",
		"hero.search": "Search equipment",
		"hero.becomeProvider": "Become a provider",

		"map.title": "Live Map",
		"map.subtitle": "Location of available machines across Senegal",
		"map.machinesCount": "Machines",
		"map.selectHint": "Click a machine to locate it",
		"map.available": "Available",
		"map.unavailable": "Unavailable",
		"map.short.available": "Free",
		"map.short.unavailable": "Busy",
		"map.estimatedPosition": "Estimated position",
		"map.gpsPosition": "GPS position",
		"map.viewDetails": "View details",
		"map.loading": "Loading map...",
		"map.noMachines": "No machines to display right now.",
		"map.zone": "Zone",
		"map.perDay": "CFA / day",
		"map.recenter": "Recenter map",
		"map.disclaimer":
			"Positions marked \"estimated\" are generated automatically until an onboard GPS is installed on each machine.",

		"common.error.loadMachines": "Couldn't load machines right now.",
	},

	// Wolof
	wo: {
		"nav.home": "Kër",
		"nav.services": "Liggéey yi",
		"nav.map": "Karte",
		"nav.login": "Dugg",
		"nav.register": "Bindu",
		"nav.dashboard": "Tablo",
		"nav.logout": "Génn",

		"hero.badge": "Plateforme bu 1er ci Senegaal",
		"hero.title": "Lóoje jumtukaay agrikóol",
		"hero.titleHighlight": "ci ndigël bu neex",
		"hero.subtitle": "Marse bu njëkk ci agrikoltir ci Senegaal",
		"hero.search": "Seet jumtukaay",
		"hero.becomeProvider": "Nekk prestatéer",

		"map.title": "Karte ci saa si",
		"map.subtitle": "Fu jumtukaay yi nekk ci Senegaal",
		"map.machinesCount": "Jumtukaay",
		"map.selectHint": "Bësal ci jumtukaay bi ngir gis fa mu nekk",
		"map.available": "Am na",
		"map.unavailable": "Amul",
		"map.short.available": "Am na",
		"map.short.unavailable": "Bare na",
		"map.estimatedPosition": "Barab bu approché",
		"map.gpsPosition": "Barab GPS",
		"map.viewDetails": "Gis leneen",
		"map.loading": "Karte bi di yëg...",
		"map.noMachines": "Amul jumtukaay pour won léegi.",
		"map.zone": "Zone",
		"map.perDay": "CFA / bés",
		"map.recenter": "Delloosi karte bi ci digg",
		"map.disclaimer":
			"Barab yi bind « approché » ñu koy defar ci automatik, ba kera GPS di sax ci jumtukaay yi.",

		"common.error.loadMachines": "Manunu génne jumtukaay yi léegi.",
	},

	// Pular (Fulfulde / Pulaar)
	ff: {
		"nav.home": "Suudu",
		"nav.services": "Golle",
		"nav.map": "Karte",
		"nav.login": "Naatde",
		"nav.register": "Winndito",
		"nav.dashboard": "Tablo",
		"nav.logout": "Yaltude",

		"hero.badge": "Plataform 1ɓal e Senegaal",
		"hero.title": "Ardito kaɓirɗe ndema",
		"hero.titleHighlight": "e newaare",
		"hero.subtitle": "Marse arano on ndema Senegaal",
		"hero.search": "Njaggu kaɓirɗe",
		"hero.becomeProvider": "Wontu Prestatɛɛr",

		"map.title": "Karte jonni",
		"map.subtitle": "Nokku kaɓirɗe ɗe woodi e Senegaal",
		"map.machinesCount": "Kaɓirɗe",
		"map.selectHint": "Ƴabbu ka kaɓirde ngam yiyde nokku mun",
		"map.available": "Woodi",
		"map.unavailable": "Alaa",
		"map.short.available": "Woodi",
		"map.short.unavailable": "Jogaama",
		"map.estimatedPosition": "Nokku sikkitaango",
		"map.gpsPosition": "Nokku GPS",
		"map.viewDetails": "Yiy ɗataa",
		"map.loading": "Karte hino njoona...",
		"map.noMachines": "Kaɓirde alaa ngam hollude jooni.",
		"map.zone": "Zone",
		"map.perDay": "CFA / ñalawma",
		"map.recenter": "Artir karte e hakkunde",
		"map.disclaimer":
			"Nokkuuji ɗi wonaa « sikkitaango » ko automatik ɗi njoɓaa, haa GPS ustaake e kala kaɓirde.",

		"common.error.loadMachines": "Waawaa yaltinde kaɓirɗe jooni.",
	},
};