const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const DBConnection = require('./config/connect')
const path = require("path");
const fs = require('fs')
const createDefaultAdmin = require('./initAdmin');
const maintenanceMiddleware = require('./middlewares/maintenanceMiddleware');
const registrationMiddleware = require('./middlewares/registrationMiddleware');

const app = express()
dotenv.config()

//////connection of DB/////////
DBConnection()
createDefaultAdmin();

const PORT = process.env.PORT 


//////middleware/////////
app.use(express.json())
app.use(cors())

const uploadsDir = path.join(__dirname, "uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

///ROUTES///
app.use('/api/admin', require('./routers/adminRoutes'))
app.use('/api/user', maintenanceMiddleware, (req, res, next) => {
  if (req.path === '/register') return registrationMiddleware(req, res, next);
  next();
}, require('./routers/userRoutes'))



app.listen(PORT, () => console.log(`running on ${PORT}`))