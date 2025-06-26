const Admin = require('./schemas/adminModel');
const bcrypt = require('bcryptjs');

async function createDefaultAdmin() {
  try {
    // Always hash the password and upsert the admin user for simplicity
    const hashed = await bcrypt.hash('admin', 10); // Default password: admin
    await Admin.findOneAndUpdate(
      { username: 'admin' },
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashed,
      },
      { upsert: true, new: true }
    );
    console.log('Default admin ensured: username=admin, password=admin');
    // Print all admins for debugging
    const allAdmins = await Admin.find();
    console.log('Current admins in DB:', allAdmins.map(a => ({ username: a.username, email: a.email })));
  } catch (err) {
    console.error('Error creating default admin:', err);
  }
}

module.exports = createDefaultAdmin; 