import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Gauge, Bell, Loader2, Crosshair, Menu } from "lucide-react";
import { Link } from "../../router";
import { servicesService } from "../../services/servicesService";
import { Service } from "../../types";
import { resolveMachineLocation } from "../../utils/simulatedLocation";
import { useLanguage } from "../../contexts/LanguageContext";

interface MachineMarker {
	service: Service;
	latitude: number;
	longitude: number;
	zoneName: string;
	isSimulated: boolean;
}

// Centre par défaut : région de Thiès, coeur du bassin agricole visé par la carte
const DEFAULT_CENTER: [number, number] = [14.75, -16.85];
const DEFAULT_ZOOM = 9;

// Icône tracteur personnalisée (évite les soucis classiques d'icônes Leaflet + bundler)
function createTractorIcon(available: boolean, selected: boolean) {
	const color = available ? "#16a34a" : "#9ca3af";
	const size = selected ? 44 : 38;
	return L.divIcon({
		className: "",
		html: `
			<div style="
				width: ${size}px;
				height: ${size}px;
				border-radius: 50% 50% 50% 0;
				background: ${color};
				transform: rotate(-45deg);
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 2px 6px rgba(0,0,0,0.35);
				border: 2px solid white;
			">
				<span style="transform: rotate(45deg); font-size: ${
					selected ? 20 : 18
				}px; line-height: 1;">🚜</span>
			</div>
		`,
		iconSize: [size, size],
		iconAnchor: [size / 2, size],
		popupAnchor: [0, -size + 4],
	});
}

/** Recentre la carte en douceur quand une machine est sélectionnée */
const FlyToSelected: React.FC<{ position: [number, number] | null }> = ({
	position,
}) => {
	const map = useMap();
	useEffect(() => {
		if (position) {
			map.flyTo(position, 13, { duration: 0.75 });
		}
	}, [position, map]);
	return null;
};

/** Bouton flottant "recentrer" façon maquette (icône crosshair en haut à droite de la carte) */
const RecenterControl: React.FC<{ onRecenter: () => void }> = ({
	onRecenter,
}) => {
	const map = useMap();
	const { t } = useLanguage();
	const handleClick = () => {
		map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.6 });
		onRecenter();
	};
	return (
		<button
			onClick={handleClick}
			title={t("map.recenter")}
			aria-label={t("map.recenter")}
			className="absolute top-4 right-4 z-[1000] w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-green-700 hover:bg-green-50 transition-colors"
		>
			<Crosshair className="w-5 h-5" />
		</button>
	);
};

export const LiveMap: React.FC = () => {
	const { t } = useLanguage();
	const [machines, setMachines] = useState<MachineMarker[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [listOpen, setListOpen] = useState(false);

	useEffect(() => {
		let isMounted = true;

		(async () => {
			try {
				setLoading(true);
				const services = await servicesService.getServices();
				if (!isMounted) return;

				const withLocations: MachineMarker[] = services.map((service) => {
					const resolved = resolveMachineLocation(
						service.id,
						service.latitude,
						service.longitude,
						service.location
					);
					return {
						service,
						latitude: resolved.latitude,
						longitude: resolved.longitude,
						zoneName: resolved.zoneName,
						isSimulated: resolved.isSimulated,
					};
				});

				setMachines(withLocations);
				setError(null);
			} catch (err: unknown) {
				if (isMounted) {
					const message =
						err instanceof Error
							? err.message
							: t("common.error.loadMachines");
					setError(message);
				}
			} finally {
				if (isMounted) setLoading(false);
			}
		})();

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const selectedMachine = useMemo(
		() => machines.find((m) => m.service.id === selectedId) || null,
		[machines, selectedId]
	);

	const flyToPosition: [number, number] | null = selectedMachine
		? [selectedMachine.latitude, selectedMachine.longitude]
		: null;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-6">
				{error && (
					<div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
						{error}
					</div>
				)}

				<div className="grid lg:grid-cols-3 gap-6">
					{/* Carte : carte flottante style maquette avec en-tête vert foncé */}
					<div className="lg:col-span-2 rounded-2xl overflow-hidden shadow-xl border border-green-900/10">
						{/* En-tête vert foncé façon "CARTE EN DIRECT" */}
						<div className="bg-green-800 text-white px-4 py-3 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<button
									onClick={() => setListOpen((v) => !v)}
									className="lg:hidden -ml-1 p-1"
									aria-label="Liste des machines"
								>
									<Menu className="w-5 h-5" />
								</button>
								<span className="font-bold tracking-wide uppercase text-sm">
									{t("map.title")}
								</span>
							</div>
							<Bell className="w-5 h-5 opacity-90" />
						</div>

						<div className="relative">
							{loading && (
								<div className="absolute inset-0 bg-white/70 z-[1000] flex items-center justify-center">
									<div className="flex items-center gap-2 text-green-700 font-medium">
										<Loader2 className="w-5 h-5 animate-spin" />
										{t("map.loading")}
									</div>
								</div>
							)}

							<MapContainer
								center={DEFAULT_CENTER}
								zoom={DEFAULT_ZOOM}
								style={{ height: "560px", width: "100%" }}
								scrollWheelZoom
							>
								<TileLayer
									attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>

								<FlyToSelected position={flyToPosition} />
								<RecenterControl onRecenter={() => setSelectedId(null)} />

								{machines.map((machine) => (
									<Marker
										key={machine.service.id}
										position={[machine.latitude, machine.longitude]}
										icon={createTractorIcon(
											machine.service.availability,
											machine.service.id === selectedId
										)}
										eventHandlers={{
											click: () => setSelectedId(machine.service.id),
										}}
									>
										<Popup>
											<div className="min-w-[200px]">
												<p className="font-bold text-gray-900">
													{machine.service.name}
												</p>
												{(machine.service.brand || machine.service.model) && (
													<p className="text-sm text-gray-600">
														{[machine.service.brand, machine.service.model]
															.filter(Boolean)
															.join(" ")}
													</p>
												)}
												<div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
													<MapPin className="w-3.5 h-3.5" />
													{t("map.zone")} : {machine.zoneName}
												</div>
												<div className="flex items-center gap-2 mt-2">
													<span
														className={`text-xs font-medium px-2 py-0.5 rounded-full ${
															machine.service.availability
																? "bg-green-100 text-green-700"
																: "bg-gray-200 text-gray-600"
														}`}
													>
														{machine.service.availability
															? t("map.available")
															: t("map.unavailable")}
													</span>
													{machine.isSimulated && (
														<span className="text-xs text-gray-400">
															{t("map.estimatedPosition")}
														</span>
													)}
												</div>
												<Link
													to={`/services/${machine.service.id}`}
													className="inline-block mt-3 text-sm font-medium text-green-700 hover:text-green-800"
												>
													{t("map.viewDetails")} →
												</Link>
											</div>
										</Popup>
									</Marker>
								))}
							</MapContainer>

							{/* Carte flottante d'info, façon maquette : apparaît en bas quand une machine est sélectionnée */}
							{selectedMachine && (
								<div className="absolute left-3 right-3 bottom-3 z-[1000] bg-white rounded-xl shadow-2xl p-4 flex items-start justify-between gap-3">
									<div>
										<p className="font-bold text-gray-900 flex items-center gap-1.5">
											🚜 {selectedMachine.service.name}
											{(selectedMachine.service.brand ||
												selectedMachine.service.model) && (
												<span className="font-normal text-gray-500">
													(
													{[
														selectedMachine.service.brand,
														selectedMachine.service.model,
													]
														.filter(Boolean)
														.join(" ")}
													)
												</span>
											)}
										</p>
										<p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
											<MapPin className="w-3.5 h-3.5" />
											{t("map.zone")} : {selectedMachine.zoneName}
											{selectedMachine.service.pricePerDay && (
												<>
													<span className="mx-1">·</span>
													<Gauge className="w-3.5 h-3.5" />
													{selectedMachine.service.pricePerDay.toLocaleString(
														"fr-FR"
													)}{" "}
													{t("map.perDay")}
												</>
											)}
										</p>
									</div>
									<Link
										to={`/services/${selectedMachine.service.id}`}
										className="shrink-0 text-sm font-semibold text-green-700 hover:text-green-800 whitespace-nowrap"
									>
										{t("map.viewDetails")} →
									</Link>
								</div>
							)}
						</div>
					</div>

					{/* Liste des machines (toujours visible sur desktop, dépliable sur mobile) */}
					<div
						className={`bg-white rounded-2xl shadow-lg border border-gray-200 flex-col max-h-[624px] ${
							listOpen ? "flex" : "hidden lg:flex"
						}`}
					>
						<div className="px-5 py-4 border-b border-gray-200">
							<h2 className="font-bold text-gray-900">
								{t("map.machinesCount")} ({machines.length})
							</h2>
							<p className="text-xs text-gray-500 mt-0.5">
								{t("map.selectHint")}
							</p>
						</div>

						<div className="overflow-y-auto flex-1 divide-y divide-gray-100">
							{!loading && machines.length === 0 && (
								<p className="p-5 text-sm text-gray-500">
									{t("map.noMachines")}
								</p>
							)}

							{machines.map((machine) => (
								<button
									key={machine.service.id}
									onClick={() => {
										setSelectedId(machine.service.id);
										setListOpen(false);
									}}
									className={`w-full text-left px-5 py-3 hover:bg-green-50 transition-colors ${
										selectedId === machine.service.id ? "bg-green-50" : ""
									}`}
								>
									<div className="flex items-start justify-between gap-2">
										<div>
											<p className="font-semibold text-gray-900 text-sm">
												{machine.service.name}
											</p>
											<p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
												<MapPin className="w-3 h-3" />
												{machine.zoneName}
											</p>
										</div>
										<span
											className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
												machine.service.availability
													? "bg-green-100 text-green-700"
													: "bg-gray-200 text-gray-600"
											}`}
										>
											{machine.service.availability
												? t("map.short.available")
												: t("map.short.unavailable")}
										</span>
									</div>
									{machine.service.pricePerDay && (
										<p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
											<Gauge className="w-3 h-3" />
											{machine.service.pricePerDay.toLocaleString("fr-FR")}{" "}
											{t("map.perDay")}
										</p>
									)}
								</button>
							))}
						</div>
					</div>
				</div>

				<p className="text-xs text-gray-400 mt-4">{t("map.disclaimer")}</p>
			</div>
		</div>
	);
};