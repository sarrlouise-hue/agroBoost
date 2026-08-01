import React, { useState } from "react";
import { Link } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { LANGUAGES, Language } from "../../i18n/translations";
import { Menu, X, User, LogOut, LayoutDashboard, Map, Globe, ChevronDown } from "lucide-react";

const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact }) => {
	const { language, setLanguage } = useLanguage();
	const [open, setOpen] = useState(false);
	const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

	const handleSelect = (code: Language) => {
		setLanguage(code);
		setOpen(false);
	};

	return (
		<div className="relative">
			<button
				onClick={() => setOpen((prev) => !prev)}
				className="flex items-center gap-1.5 text-gray-700 hover:text-green-600 transition-colors font-medium px-2 py-1.5 rounded-lg hover:bg-gray-50"
				aria-haspopup="true"
				aria-expanded={open}
			>
				{compact ? (
					<Globe className="w-4 h-4" />
				) : (
					<span className="text-base leading-none">{current.flag}</span>
				)}
				<span className={compact ? "sr-only" : "text-sm"}>{current.label}</span>
				<ChevronDown className="w-3.5 h-3.5" />
			</button>

			{open && (
				<>
					<div
						className="fixed inset-0 z-40"
						onClick={() => setOpen(false)}
						aria-hidden="true"
					/>
					<div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
						{LANGUAGES.map((lang) => (
							<button
								key={lang.code}
								onClick={() => handleSelect(lang.code)}
								className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-green-50 transition-colors ${
									lang.code === language
										? "text-green-700 font-semibold"
										: "text-gray-700"
								}`}
							>
								<span className="text-base leading-none">{lang.flag}</span>
								{lang.label}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export const Header: React.FC = () => {
	const { user, profile, signOut } = useAuth();
	const { t } = useLanguage();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			setMobileMenuOpen(false);
		} catch (error) {
			console.error("Error signing out:", error);
		}
	};

	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<nav className="container mx-auto px-4 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link to="/" className="flex items-center space-x-3 group">
						<div className="relative">
							<div className="absolute inset-0 bg-green-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
							<div className="relative bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform overflow-hidden">
								<img
									src="/TRACTLOGO.jpg"
									alt="TRACTLOGO"
									className="w-7 h-7 object-contain rounded"
									style={{ filter: "brightness(1.05) saturate(1.05)" }}
								/>
							</div>
						</div>
						<div className="flex flex-col">
							<span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
								AlloTracteur
							</span>
							<span className="text-xs text-gray-500 -mt-1">
								Location d'équipements
							</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-6">
						<Link
							to="/"
							className="text-gray-700 hover:text-green-600 transition-colors font-medium"
						>
							{t("nav.home")}
						</Link>
						<Link
							to="/services"
							className="text-gray-700 hover:text-green-600 transition-colors font-medium"
						>
							{t("nav.services")}
						</Link>
						<Link
							to="/carte"
							className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center gap-1"
						>
							<Map className="w-4 h-4" />
							{t("nav.map")}
						</Link>

						{user ? (
							<>
								<Link
									to="/dashboard"
									className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-1"
								>
									<LayoutDashboard className="w-4 h-4" />
									<span>{t("nav.dashboard")}</span>
								</Link>

								{profile?.role === "prestataire" && (
									<Link
										to="/create-service"
										className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
									>
										Ajouter un service
									</Link>
								)}

								<div className="flex items-center space-x-4">
									<div className="flex items-center space-x-2 text-gray-700">
										<User className="w-5 h-5" />
										<span className="font-medium">
											{profile?.fullName || user.email}
										</span>
									</div>
									<button
										onClick={handleSignOut}
										className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
									>
										<LogOut className="w-5 h-5" />
										<span>{t("nav.logout")}</span>
									</button>
								</div>
							</>
						) : (
							<>
								<Link
									to="/login"
									className="text-gray-700 hover:text-green-600 transition-colors font-medium"
								>
									{t("nav.login")}
								</Link>
								<Link
									to="/register"
									className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
								>
									{t("nav.register")}
								</Link>
							</>
						)}

						<div className="border-l border-gray-200 pl-4">
							<LanguageSwitcher />
						</div>
					</div>

					{/* Mobile: language + menu button */}
					<div className="flex items-center gap-2 md:hidden">
						<LanguageSwitcher compact />
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="text-gray-700 hover:text-green-600"
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{mobileMenuOpen && (
					<div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide">
						<div className="flex flex-col space-y-4">
							<Link
								to="/"
								className="text-gray-700 hover:text-green-600 transition-colors font-medium"
								onClick={() => setMobileMenuOpen(false)}
							>
								{t("nav.home")}
							</Link>
							<Link
								to="/services"
								className="text-gray-700 hover:text-green-600 transition-colors font-medium"
								onClick={() => setMobileMenuOpen(false)}
							>
								{t("nav.services")}
							</Link>
							<Link
								to="/carte"
								className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center gap-2"
								onClick={() => setMobileMenuOpen(false)}
							>
								<Map className="w-4 h-4" />
								{t("nav.map")}
							</Link>

							{user ? (
								<>
									<Link
										to="/dashboard"
										className="text-gray-700 hover:text-green-600 transition-colors font-medium flex items-center space-x-2"
										onClick={() => setMobileMenuOpen(false)}
									>
										<LayoutDashboard className="w-4 h-4" />
										<span>{t("nav.dashboard")}</span>
									</Link>

									{profile?.role === "prestataire" && (
										<Link
											to="/create-service"
											className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
											onClick={() => setMobileMenuOpen(false)}
										>
											Ajouter un service
										</Link>
									)}

									<div className="border-t border-gray-200 pt-4 mt-4">
										<div className="flex items-center space-x-2 text-gray-700 mb-4">
											<User className="w-5 h-5" />
											<span className="font-medium">
												{profile?.fullName || user.email}
											</span>
										</div>
										<button
											onClick={handleSignOut}
											className="w-full flex items-center justify-center space-x-2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
										>
											<LogOut className="w-5 h-5" />
											<span>{t("nav.logout")}</span>
										</button>
									</div>
								</>
							) : (
								<>
									<Link
										to="/login"
										className="text-gray-700 hover:text-green-600 transition-colors font-medium"
										onClick={() => setMobileMenuOpen(false)}
									>
										{t("nav.login")}
									</Link>
									<Link
										to="/register"
										className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
										onClick={() => setMobileMenuOpen(false)}
									>
										{t("nav.register")}
									</Link>
								</>
							)}
						</div>
					</div>
				)}
			</nav>
		</header>
	);
};