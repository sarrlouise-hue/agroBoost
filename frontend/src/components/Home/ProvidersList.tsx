import React from "react";
import { MapPin, Star } from "lucide-react";

export const ProvidersList: React.FC = () => {
	const providers = [
		{
			name: "Moussa Diop",
			location: "Thiès",
			rating: 4.8,
			reviews: 25,
			machines: 8,
			avatar:
				"https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
		},
		{
			name: "Fatou Sall",
			location: "Kaolack",
			rating: 4.9,
			reviews: 32,
			machines: 12,
			avatar:
				"https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
		},
		{
			name: "Ibrahima Ndiaye",
			location: "Saint-Louis",
			rating: 4.7,
			reviews: 18,
			machines: 6,
			avatar:
				"https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200",
		},
	];

	return (
		<section className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Nos prestataires
					</h2>
					<p className="text-xl text-gray-600">
						Des professionnels vérifiés partout au Sénégal
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{providers.map((provider, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:shadow-xl transition-all duration-300"
						>
							<div className="flex items-start gap-4 mb-4">
								<img
									src={provider.avatar}
									alt={provider.name}
									className="w-16 h-16 rounded-full object-cover"
								/>
								<div className="flex-1">
									<h3 className="text-lg font-bold text-gray-900">
										{provider.name}
									</h3>
									<div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
										<MapPin className="w-4 h-4" />
										{provider.location}
									</div>
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className="flex gap-0.5">
										{[...Array(5)].map((_, i) => (
											<Star
												key={i}
												className="w-4 h-4 fill-yellow-400 text-yellow-400"
											/>
										))}
									</div>
									<span className="text-sm font-semibold text-gray-900">
										{provider.rating}
									</span>
									<span className="text-sm text-gray-500">
										({provider.reviews} avis)
									</span>
								</div>
							</div>
							<div className="mt-4 pt-4 border-t border-gray-100">
								<p className="text-sm text-gray-600">
									{provider.machines} machines disponibles
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
