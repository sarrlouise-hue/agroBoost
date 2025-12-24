const { connectDB } = require("../src/config/database");
const User = require("../src/models/User");
const { ROLES } = require("../src/config/constants");
const bcrypt = require("bcryptjs"); // bcryptjs is used in User model hooks, so creating with plain password triggers the hook if configured correctly, but User model hooks handle hashing.

async function seedMechanics() {
	try {
		await connectDB();
		console.log("Connected to database...");

		const mechanicsData = [
			{
				firstName: "Jean",
				lastName: "Mecanicien",
				email: "jean.mecanicien@agroboost.com",
				password: "password123",
				phoneNumber: "+221770000001",
				role: ROLES.MECHANIC,
				address: "Dakar, Senegal",
				isVerified: true,
			},
			{
				firstName: "Paul",
				lastName: "Reparateur",
				email: "paul.reparateur@agroboost.com",
				password: "password123",
				phoneNumber: "+221770000002",
				role: ROLES.MECHANIC,
				address: "Thies, Senegal",
				isVerified: true,
			},
		];

		for (const data of mechanicsData) {
			const existing = await User.findOne({ where: { email: data.email } });
			if (!existing) {
				// User model hooks will hash the password
				const user = await User.create(data);
				console.log(
					`✅ Created mechanic: ${user.firstName} ${user.lastName} (ID: ${user.id})`
				);
			} else {
				console.log(
					`ℹ️ Mechanic already exists: ${existing.email} (ID: ${existing.id})`
				);

				// Ensure role is mechanic just in case
				if (existing.role !== ROLES.MECHANIC) {
					existing.role = ROLES.MECHANIC;
					await existing.save();
					console.log(`🔄 Updated role to MECHANIC for ${existing.email}`);
				}
			}
		}

		console.log("\n🎉 Mechanic seeding completed successfully.");
		process.exit(0);
	} catch (error) {
		console.error("❌ Error seeding mechanics:", error);
		process.exit(1);
	}
}

seedMechanics();
