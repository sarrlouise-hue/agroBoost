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

			{/* Light readability scrim — much subtler than before since the bright sky already gives good contrast, like on the live site */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0) 60%)",
				}}
			/>

			<div className="relative z-10">
				<span className="sr-only">{totalCount} machines disponibles</span>
				<div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 lg:py-24">
					<div className="space-y-6 text-left">
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

						<div className="flex flex-col items-start gap-4 pt-2">
							<Link to="/services">
								<button className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
									<Search className="w-5 h-5" />
									Rechercher du matériel
									<span aria-hidden="true">→</span>
								</button>
							</Link>

							<Link to="/register">
								<button className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
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
