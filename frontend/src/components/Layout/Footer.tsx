import React from "react";
import { Link } from "../../router";
import {
	Tractor,
	Mail,
	Phone,
	MapPin,
	Facebook,
	Twitter,
	Instagram,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	const { t } = useLanguage();

	return (
		<footer className="bg-gray-900 text-gray-300">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* About Section */}
					<div>
						<div className="flex items-center space-x-2 mb-4">
							<Tractor className="w-8 h-8 text-green-500" />
							<span className="text-2xl font-bold text-white">
								AlloTracteur
							</span>
						</div>
						<p className="text-gray-400 mb-4">{t("footer.about")}</p>
						<div className="flex space-x-4">
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-green-500 transition-colors"
							>
								<Facebook className="w-5 h-5" />
							</a>
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-green-500 transition-colors"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href="https://instagram.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-400 hover:text-green-500 transition-colors"
							>
								<Instagram className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">
							{t("footer.quickLinks")}
						</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									{t("nav.home")}
								</Link>
							</li>
							<li>
								<Link
									to="/services"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									{t("footer.availableMachines")}
								</Link>
							</li>
							<li>
								<Link
									to="/register"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									{t("nav.register")}
								</Link>
							</li>
							<li>
								<Link
									to="/login"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									{t("nav.login")}
								</Link>
							</li>
						</ul>
					</div>

					{/* Services */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">
							{t("footer.services")}
						</h3>
						<ul className="space-y-2">
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									{t("footer.tractorRental")}
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									{t("footer.harvesterRental")}
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									{t("footer.irrigation")}
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									{t("footer.tools")}
								</a>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-white font-semibold text-lg mb-4">
							{t("footer.contact")}
						</h3>
						<ul className="space-y-3">
							<li className="flex items-start space-x-3">
								<MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
								<span className="text-gray-400">
									Dakar, Sénégal
									<br />
									Région de Thiès
								</span>
							</li>
							<li className="flex items-center space-x-3">
								<Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
								<a
									href="tel:+221123456789"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									+221 12 345 67 89
								</a>
							</li>
							<li className="flex items-center space-x-3">
								<Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
								<a
									href="mailto:contact@allotracteur.sn"
									className="text-gray-400 hover:text-green-500 transition-colors"
								>
									contact@allotracteur.sn
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-400 text-sm mb-4 md:mb-0">
						&copy; {currentYear} AlloTracteur. {t("footer.rights")}
					</p>
					<div className="flex space-x-6">
						<a
							href="#"
							className="text-gray-400 hover:text-green-500 transition-colors text-sm"
						>
							{t("footer.terms")}
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-green-500 transition-colors text-sm"
						>
							{t("footer.privacy")}
						</a>
						<a
							href="#"
							className="text-gray-400 hover:text-green-500 transition-colors text-sm"
						>
							{t("footer.cgv")}
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};