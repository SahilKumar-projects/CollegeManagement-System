require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/details/admin-details.model");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    const existing = await Admin.findOne({ email: "admin@gmail.com" });
    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    const admin = new Admin({
      employeeId: 123456,
      firstName: "Admin",
      lastName: "User",
      email: "admin@gmail.com",
      phone: "9999999999",
      address: "Main Admin Office",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
      gender: "male",
      dob: new Date("1990-01-01"),
      designation: "System Administrator",
      joiningDate: new Date(),
      salary: 50000,
      isSuperAdmin: true,
      bloodGroup: "O+",
      emergencyContact: {
        name: "Emergency",
        relationship: "Self",
        phone: "9999999999",
      },
      password: "admin123", // 🔐 will be hashed automatically
    });

    await admin.save();
    console.log("✅ Admin created successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Seeder error:", err);
    process.exit(1);
  }
}
const dbName = mongoose.connection.name;
console.log("🧠 Connected DB:", dbName);


seedAdmin();
