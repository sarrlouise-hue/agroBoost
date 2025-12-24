const http = require("http");

const checkRoute = (method, path) => {
	return new Promise((resolve) => {
		const options = {
			hostname: "localhost",
			port: 3000,
			path: path,
			method: method,
		};

		const req = http.request(options, (res) => {
			resolve({ status: res.statusCode, path, method });
		});

		req.on("error", (e) => {
			resolve({ error: e.message, path, method });
		});

		req.end();
	});
};

async function verify() {
	console.log("Verifying routes accessibility...");

	// Test POST /api/services (User had 404)
	// Expected: 401 (Unauthorized) because valid token is missing, but NOT 404.
	const servicesRes = await checkRoute("POST", "/api/services");
	console.log(
		`[${servicesRes.method} ${servicesRes.path}] Status: ${servicesRes.status}`
	);
	if (servicesRes.status === 404) console.error("❌ Still returning 404!");
	else if (servicesRes.status === 401)
		console.log("✅ Route found (401 Unauthorized is expected without token)");
	else console.log(`Result: ${servicesRes.status}`);

	// Test POST /api/maintenances (User had 400/404 issues context)
	const maintRes = await checkRoute("POST", "/api/maintenances");
	console.log(
		`[${maintRes.method} ${maintRes.path}] Status: ${maintRes.status}`
	);
	if (maintRes.status === 404) console.error("❌ Still returning 404!");
	else if (maintRes.status === 401)
		console.log("✅ Route found (401 Unauthorized is expected without token)");
	else console.log(`Result: ${maintRes.status}`);

	process.exit(0);
}

verify();
