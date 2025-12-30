import React, { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { bookingsService } from "../../../services/bookingsService";
import {
	Calendar,
	User,
	DollarSign,
	Clock,
	CheckCircle,
	XCircle,
	AlertCircle,
	Search,
} from "lucide-react";
import { Booking } from "../../../lib/api";

export const PrestataireManageBookings: React.FC = () => {
	const { user } = useAuth();
	const [bookings, setBookings] = useState<Booking[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<string>("all");
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		fetchBookings();
	}, []);

	const fetchBookings = async () => {
		try {
			const data = await bookingsService.getReceivedBookings();
			setBookings(data);
		} catch (error) {
			console.error("Erreur chargement réservations:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleConfirm = async (id: string) => {
		if (!confirm("Confirmer cette réservation ?")) return;
		try {
			await bookingsService.confirmBooking(id);
			fetchBookings();
		} catch (error: any) {
			alert(error.message || "Erreur lors de la confirmation");
		}
	};

	const handleCancel = async (id: string) => {
		if (!confirm("Annuler cette réservation ?")) return;
		try {
			await bookingsService.cancelBooking(id);
			fetchBookings();
		} catch (error: any) {
			alert(error.message || "Erreur lors de l'annulation");
		}
	};

	const handleComplete = async (id: string) => {
		if (!confirm("Marquer comme terminée ?")) return;
		try {
			await bookingsService.completeBooking(id);
			fetchBookings();
		} catch (error: any) {
			alert(error.message || "Erreur lors de la finalisation");
		}
	};

	const getStatusBadge = (status: string) => {
		const statusConfig: {
			[key: string]: { bg: string; text: string; icon: any; label: string };
		} = {
			pending: {
				bg: "bg-yellow-100",
				text: "text-yellow-800",
				icon: Clock,
				label: "En attente",
			},
			confirmed: {
				bg: "bg-blue-100",
				text: "text-blue-800",
				icon: CheckCircle,
				label: "Confirmée",
			},
			completed: {
				bg: "bg-green-100",
				text: "text-green-800",
				icon: CheckCircle,
				label: "Terminée",
			},
			cancelled: {
				bg: "bg-red-100",
				text: "text-red-800",
				icon: XCircle,
				label: "Annulée",
			},
		};

		const config = statusConfig[status] || statusConfig.pending;
		const Icon = config.icon;

		return (
			<span
				className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} flex items-center space-x-1`}
			>
				<Icon className="w-4 h-4" />
				<span>{config.label}</span>
			</span>
		);
	};

	const filteredBookings = bookings.filter((booking) => {
		const matchesFilter = filter === "all" || booking.status === filter;
		const matchesSearch =
			searchTerm === "" ||
			booking.user?.firstName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			booking.user?.lastName
				?.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			booking.service?.name?.toLowerCase().includes(searchTerm.toLowerCase());

		return matchesFilter && matchesSearch;
	});

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					<input
						type="text"
						placeholder="Rechercher par client ou service..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 transition-all"
					/>
				</div>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="px-4 py-2 border border-gray-300 rounded-lg"
				>
					<option value="all">Tous les statuts</option>
					<option value="pending">En attente</option>
					<option value="confirmed">Confirmées</option>
					<option value="completed">Terminées</option>
					<option value="cancelled">Annulées</option>
				</select>
			</div>

			<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Client
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Service
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Période
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Montant
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Statut
								</th>
								<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{filteredBookings.map((booking) => (
								<tr
									key={booking.id}
									className="hover:bg-gray-50 transition-colors"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="bg-green-100 p-2 rounded-full mr-3 text-green-700">
												<User className="w-4 h-4" />
											</div>
											<div>
												<div className="text-sm font-bold text-gray-900">
													{booking.user?.firstName} {booking.user?.lastName}
												</div>
												<div className="text-xs text-gray-500">
													{booking.user?.phoneNumber}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
										{booking.service?.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{booking.startDate ? (
											<>
												<div>
													Du{" "}
													{new Date(booking.startDate).toLocaleDateString(
														"fr-FR"
													)}
												</div>
												<div>
													Au{" "}
													{new Date(booking.endDate).toLocaleDateString(
														"fr-FR"
													)}
												</div>
											</>
										) : (
											<div>
												Le{" "}
												{new Date(booking.bookingDate || "").toLocaleDateString(
													"fr-FR"
												)}{" "}
												à {booking.startTime}
											</div>
										)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-bold text-green-600">
											{booking.totalPrice?.toLocaleString()} FCFA
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										{getStatusBadge(booking.status)}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<div className="flex space-x-2">
											{booking.status === "pending" && (
												<>
													<button
														onClick={() => handleConfirm(booking.id)}
														className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
													>
														Confirmer
													</button>
													<button
														onClick={() => handleCancel(booking.id)}
														className="text-red-600 hover:bg-red-50 px-3 py-1 rounded transition"
													>
														Refuser
													</button>
												</>
											)}
											{booking.status === "confirmed" && (
												<button
													onClick={() => handleComplete(booking.id)}
													className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
												>
													Terminer
												</button>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{filteredBookings.length === 0 && (
						<div className="text-center py-12 text-gray-500">
							Aucune réservation trouvée.
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default PrestataireManageBookings;
