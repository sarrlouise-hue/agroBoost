import React from "react";
import { Link } from "../../router";
import { Search, Star } from "lucide-react";

interface HeroProps {
	totalCount: number;
}

export const Hero: React.FC<HeroProps> = ({ totalCount }) => {
	return (
		<section className="relative overflow-hidden">
			{/* Background tractor image, full-bleed like the production site */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					backgroundImage: "url('/trac.png')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					filter: "saturate(1.05)",
				}}
			/>

			{/* Subtle dark scrim: a bit stronger at top (behind heading) and bottom (behind paragraph/buttons), lighter in the middle so the tractor photo stays clearly visible */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.05) 32%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.5) 100%)",
				}}
			/>

			<div className="relative z-10">
				<span className="sr-only">{totalCount} machines disponibles</span>
				<div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 lg:py-24">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
							<Star className="w-4 h-4 fill-current" />
							<span>Plateforme N° 1 au Sénégal</span>
						</div>

						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md">
							Louez du matériel agricole{" "}
							<span className="text-green-200">en toute simplicité</span>
						</h1>

						<p className="text-lg sm:text-xl text-white font-medium leading-relaxed drop-shadow-md">
							La première place de marché pour l'agriculture au Sénégal
						</p>

						<div className="flex flex-col items-center sm:items-start gap-4 pt-2">
							<Link to="/services" className="w-[85%] sm:w-auto">
								<button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
									<Search className="w-5 h-5" />
									Rechercher du matériel
									<span aria-hidden="true">→</span>
								</button>
							</Link>

							<Link to="/register" className="w-[85%] sm:w-auto">
								<button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
									Devenir prestataire
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
