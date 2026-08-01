import React, { useState } from "react";
import { Link, useRouter } from "../../router";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import {
	Tractor,
	Mail,
	Lock,
	User,
	Phone,
	AlertCircle,
	CheckCircle2,
	Eye,
	EyeOff,
} from "lucide-react";

export const Register: React.FC = () => {
	const { signUp } = useAuth();
	const { navigate } = useRouter();
	const { t } = useLanguage();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
		role: "producteur" as "producteur" | "prestataire",
		acceptedTerms: false,
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value =
			e.target.type === "checkbox" ? e.target.checked : e.target.value;
		setFormData({
			...formData,
			[e.target.name]: value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (formData.password !== formData.confirmPassword) {
			setError(t("auth.register.error.passwordMismatch"));
			return;
		}

		if (formData.password.length < 6) {
			setError(t("auth.register.error.passwordLength"));
			return;
		}

		if (!formData.phoneNumber) {
			setError(t("auth.register.error.phoneRequired"));
			return;
		}

		if (!formData.acceptedTerms) {
			setError(t("auth.register.error.termsRequired"));
			return;
		}

		setLoading(true);

		try {
			await signUp(
				formData.email,
				formData.password,
				formData.firstName,
				formData.lastName,
				formData.role,
				formData.phoneNumber
			);
			navigate("/verify-otp", { state: { email: formData.email } });
		} catch (err: any) {
			setError(err.message || t("auth.register.error.generic"));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
			{/* Background */}
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
			{/* Overlay */}
			<div
				aria-hidden="true"
				className="absolute inset-0"
				style={{ background: "rgba(255, 255, 255, 0.82)" }}
			/>

			<div className="relative z-10 max-w-[480px] w-full bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-gray-100 p-8 sm:p-10">
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-2 mb-6">
						<Tractor className="w-8 h-8 text-green-600" strokeWidth={2.5} />
						<span className="text-2xl font-bold text-gray-900">
							AlloTracteur
						</span>
					</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						{t("auth.register.title")}
					</h2>
					<p className="text-gray-500 text-sm">
						{t("auth.register.subtitle")}
					</p>
				</div>

				{error && (
					<div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
						<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
						<p className="text-red-800 text-sm font-medium">{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-3 ml-1">
							{t("auth.register.iAm")}
						</label>
						<div className="grid grid-cols-2 gap-4">
							<button
								type="button"
								onClick={() => setFormData({ ...formData, role: "producteur" })}
								className={`relative p-4 border rounded-xl flex flex-col items-center justify-center h-[100px] transition-all duration-200 ${
									formData.role === "producteur"
										? "border-green-600 bg-green-50/50"
										: "border-gray-200 hover:border-gray-300 bg-white"
								}`}
							>
								<span
									className={`font-semibold mb-1 ${
										formData.role === "producteur"
											? "text-gray-900"
											: "text-gray-600"
									}`}
								>
									{t("auth.register.producer")}
								</span>
								<span className="text-xs text-gray-500">
									{t("auth.register.producerDesc")}
								</span>
								{formData.role === "producteur" && (
									<div className="mt-2">
										<CheckCircle2 className="w-5 h-5 text-green-600" />
									</div>
								)}
							</button>

							<button
								type="button"
								onClick={() =>
									setFormData({ ...formData, role: "prestataire" })
								}
								className={`relative p-4 border rounded-xl flex flex-col items-center justify-center h-[100px] transition-all duration-200 ${
									formData.role === "prestataire"
										? "border-green-600 bg-green-50/50"
										: "border-gray-200 hover:border-gray-300 bg-white"
								}`}
							>
								<span
									className={`font-semibold mb-1 ${
										formData.role === "prestataire"
											? "text-gray-900"
											: "text-gray-600"
									}`}
								>
									{t("auth.register.provider")}
								</span>
								<span className="text-xs text-gray-500">
									{t("auth.register.providerDesc")}
								</span>
								{formData.role === "prestataire" && (
									<div className="mt-2">
										<CheckCircle2 className="w-5 h-5 text-green-600" />
									</div>
								)}
							</button>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
								{t("auth.register.firstName")}
							</label>
							<div className="relative">
								<User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1.5]" />
								<input
									name="firstName"
									type="text"
									required
									value={formData.firstName}
									onChange={handleChange}
									className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all outline-none placeholder-gray-400"
									placeholder={t("auth.register.firstName")}
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
								{t("auth.register.lastName")}
							</label>
							<div className="relative">
								<User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1.5]" />
								<input
									name="lastName"
									type="text"
									required
									value={formData.lastName}
									onChange={handleChange}
									className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all outline-none placeholder-gray-400"
									placeholder={t("auth.register.lastName")}
								/>
							</div>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
							{t("auth.register.email")}
						</label>
						<div className="relative">
							<Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1.5]" />
							<input
								name="email"
								type="email"
								required
								value={formData.email}
								onChange={handleChange}
								className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all outline-none placeholder-gray-400"
								placeholder="votre@email.com"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
							{t("auth.register.phone")}
						</label>
						<div className="relative">
							<Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1.5]" />
							<input
								name="phoneNumber"
								type="tel"
								value={formData.phoneNumber}
								onChange={handleChange}
								className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all outline-none placeholder-gray-400"
								placeholder="+221 XX XXX XX XX"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
							{t("auth.register.password")}
						</label>
						<div className="relative">
							<Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1.5]" />
							<input
								name="password"
								type={showPassword ? "text" : "password"}
								required
								value={formData.password}
								onChange={handleChange}
								className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all outline-none placeholder-gray-400"
								placeholder="........"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								{showPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
							{t("auth.register.confirmPassword")}
						</label>
						<div className="relative">
							<Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 stroke-[1.5]" />
							<input
								name="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								className="w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-green-600 focus:border-green-600 transition-all outline-none placeholder-gray-400"
								placeholder="........"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								{showConfirmPassword ? (
									<EyeOff className="w-5 h-5" />
								) : (
									<Eye className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>

					<div className="flex items-start mt-4">
						<div className="flex h-5 items-center">
							<input
								id="acceptedTerms"
								name="acceptedTerms"
								type="checkbox"
								required
								checked={formData.acceptedTerms}
								onChange={handleChange}
								className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
							/>
						</div>
						<div className="ml-2 text-sm">
							<label htmlFor="acceptedTerms" className="text-gray-500">
								{t("auth.register.acceptTerms1")}{" "}
								<a
									href="#"
									className="font-medium text-green-600 hover:text-green-500"
								>
									{t("auth.register.terms")}
								</a>{" "}
								{t("auth.register.acceptTerms2")}{" "}
								<a
									href="#"
									className="font-medium text-green-600 hover:text-green-500"
								>
									{t("auth.register.privacy")}
								</a>
							</label>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-green-600 text-white py-3.5 rounded-lg hover:bg-green-700 transition-all font-bold text-base shadow-sm disabled:opacity-50 mt-6"
					>
						{loading
							? t("auth.register.submitting")
							: t("auth.register.submit")}
					</button>

					<div className="pt-2 text-center text-sm">
						<p className="text-gray-500">
							{t("auth.register.haveAccount")}{" "}
							<Link
								to="/login"
								className="text-green-600 hover:text-green-700 font-medium"
							>
								{t("auth.register.logIn")}
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};