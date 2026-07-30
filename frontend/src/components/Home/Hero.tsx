import React from "react";
import { Link } from "../../router";
import { Search, Tractor, Star, ArrowRight } from "lucide-react";

interface HeroProps {
	totalCount: number;
}

export const Hero: React.FC<HeroProps> = ({ totalCount }) => {
	return (
		<section className="relative overflow-hidden min-h-[650px] lg:min-h-[720px]">

			{/* Background */}
			<div
				aria-hidden="true"
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: "url('/trac.png')",
				}}
			/>

			{/* Overlay */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 35%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0.55) 100%)",
				}}
			/>

			<div className="relative z-10">
				<div className="max-w-3xl mx-auto px-4 py-12 sm:py-16 lg:py-24 text-center sm:text-left">

					<div className="space-y-6">

						{/* Badge */}
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
							<Star className="w-4 h-4 fill-current" />
							<span>Plateforme N° 1 au Sénégal</span>
						</div>

						{/* Titre */}
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
							Louez du matériel agricole
							<span className="block mt-2 text-green-600">
								en toute simplicité
							</span>
						</h1>

						{/* Description */}
						<p className="text-lg sm:text-xl text-white font-medium leading-relaxed drop-shadow-sm">
							La première place de marché pour l'agriculture au Sénégal
						</p>

						{/* Boutons */}
						<div className="flex flex-col gap-3 pt-3 max-w-md">

							<Link to="/services" className="w-full">
								<button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200">

									<Search className="w-4 h-4" />

									Rechercher du matériel

									<ArrowRight className="w-4 h-4" />

								</button>
							</Link>

							<Link to="/register" className="w-full">
								<button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200">

									Devenir prestataire

									<ArrowRight className="w-4 h-4" />

								</button>
							</Link>

						</div>

						{/* Statistiques */}
						{totalCount > 0 && (
							<div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md">

								<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
									<Tractor className="w-5 h-5 text-green-600" />
								</div>

								<div className="text-left">
									<p className="text-lg font-bold text-gray-900">
										{totalCount}+
									</p>

									<p className="text-xs text-gray-600">
										Machines disponibles
									</p>
								</div>

							</div>
						)}

					</div>

				</div>
			</div>

		</section>
	);
};
