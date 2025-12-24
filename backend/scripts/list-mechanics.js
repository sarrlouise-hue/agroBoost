const { connectDB } = require("../src/config/database");
const User = require("../src/models/User");
const { ROLES } = require("../src/config/constants");

async function listMechanics() {
	try {
		await connectDB();
		console.log("Connected to database...");

		const mechanics = await User.findAll({
			where: { role: ROLES.MECHANIC },
			attributes: ["id", "firstName", "lastName", "email", "role"],
		});

		console.log(`Found ${mechanics.length} mechanics:`);
		mechanics.forEach((m) => {
			console.log(`- ${m.firstName} ${m.lastName} (${m.email}) [ID: ${m.id}]`);
		});

		process.exit(0);
	} catch (error) {
		console.error("Error listing mechanics:", error);
		process.exit(1);
	}
}

listMechanics();
