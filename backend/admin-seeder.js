const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const AdminDetails = require("./models/details/admin-details.model");

mongoose.connect(process.env.MONGO_URI);

async function seedAdmin() {
  try {
    await AdminDetails.deleteMany({});

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await AdminDetails.create({
      email: "admin@gmail.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      phone: "1234567890",
      gender: "male",
      status: "active",
      isSuperAdmin: true,
    });

    console.log("✅ Admin created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  }
}

seedAdmin();
