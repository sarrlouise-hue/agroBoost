import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export const HowItWorks: React.FC = () => {
	const { t } = useLanguage();

	const steps = [
		{
			step: "1",
			title: t("howItWorks.step1.title"),
			description: t("howItWorks.step1.desc"),
			image:
				"https://images.pexels.com/photos/19518397/pexels-photo-19518397.jpeg?auto=compress&cs=tinysrgb&w=400",
		},
		{
			step: "2",
			title: t("howItWorks.step2.title"),
			description: t("howItWorks.step2.desc"),
			image:
				"https://images.pexels.com/photos/20432829/pexels-photo-20432829.jpeg?auto=compress&cs=tinysrgb&w=400",
		},
		{
			step: "3",
			title: t("howItWorks.step3.title"),
			description: t("howItWorks.step3.desc"),
			image:
				"https://images.pexels.com/photos/11350430/pexels-photo-11350430.jpeg?auto=compress&cs=tinysrgb&w=400",
		},
	];

	return (
		<section className="relative py-20 bg-gradient-to-br from-green-600 to-emerald-700 overflow-hidden">
			{/* Texture décorative en fond, pour donner du relief */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-10"
				style={{
					backgroundImage:
						"radial-gradient(circle, white 1.5px, transparent 1.5px)",
					backgroundSize: "28px 28px",
				}}
			/>

			<div className="relative max-w-7xl mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-white mb-4">
						{t("howItWorks.title")}
					</h2>
					<p className="text-xl text-green-100">{t("howItWorks.subtitle")}</p>
				</div>

				{/* Ligne de connexion entre les étapes (desktop uniquement) */}
				<div className="hidden md:block absolute top-[188px] left-[16.66%] right-[16.66%] h-0.5">
					<div className="w-full h-full border-t-2 border-dashed border-white/40" />
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{steps.map((step, index) => (
						<div key={index} className="relative">
							<div className="bg-white rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
								<div className="relative h-48">
									<img
										src={step.image}
										alt={step.title}
										loading="lazy"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
									<div className="absolute top-4 left-4 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg ring-4 ring-white/40">
										{step.step}
									</div>
								</div>
								<div className="p-6">
									<h3 className="text-2xl font-bold text-gray-900 mb-3">
										{step.title}
									</h3>
									<p className="text-gray-600">{step.description}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
