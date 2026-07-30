import React from "react";
import { Link } from "../../router";
import { Search, Tractor, Star } from "lucide-react";

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
					backgroundImage: "url('https://chatgpt.com/backend-api/estuary/public_content/enc/eyJpZCI6Im1fNmE0ZDRkYWJjZjcwODE5MWEyMzg0YzExYmRiNzdmYzU6ZmlsZV8wMDAwMDAwMGI1Mzg3MWY0OWY0YTViMGQyNjExMDc2YSIsImdpem1vX2lkIjpudWxsLCJ3aWQiOm51bGwsIm9pZCI6bnVsbCwidHMiOiIyMDY2NCIsInAiOiJweWkiLCJjaWQiOiIxIiwic2lnIjoiYjFiYjdkOGIzMTdhY2JhNTM0OTdjNmViYzExMjY5YjgyM2QxYTgxMzUyNzc4ZTE4MzU1MmJkNzQ1OTMzYjVmNiIsInYiOiIwIiwiY3MiOm51bGwsImNkbiI6bnVsbCwiZm4iOm51bGwsImNkIjpudWxsLCJjcCI6bnVsbCwibWEiOm51bGx9')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
					filter: "saturate(1.05)",
				}}
			/>

			{/* Overlay for text readability, lighter at top (behind badge/heading), darker toward bottom (behind text/buttons) */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{
					background:
						"linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 35%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0.55) 100%)",
				}}
			/>

			<div className="relative z-10">
				<div className="max-w-3xl mx-auto px-4 py-10 sm:py-16 lg:py-24 text-center sm:text-left">
					<div className="space-y-6">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
							<Star className="w-4 h-4 fill-current" />
							<span>Plateforme N° 1 au Sénégal</span>
						</div>

						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
							Louez du matériel agricole
							<span className="block text-green-600 mt-1">
								en toute simplicité
							</span>
						</h1>

						<p className="text-lg sm:text-xl text-white font-medium leading-relaxed drop-shadow-sm">
							La première place de marché pour l'agriculture au Sénégal
						</p>

						<div className="flex flex-col gap-4 pt-2">
							<Link to="/machines" className="w-full">
								<button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
									<Search className="w-5 h-5" />
									Rechercher du matériel
									<span aria-hidden="true">→</span>
								</button>
							</Link>

							<Link to="/register" className="w-full">
								<button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
									Devenir prestataire
								</button>
							</Link>
						</div>

						{totalCount > 0 && (
							<div className="inline-flex items-center gap-3 pt-2 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-xl shadow-md">
								<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
									<Tractor className="w-5 h-5 text-green-600" />
								</div>
								<div className="text-left">
									<p className="text-lg font-bold text-gray-900 leading-none">
										{totalCount}+
									</p>
									<p className="text-xs text-gray-600 mt-0.5">
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
