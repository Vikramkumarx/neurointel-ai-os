const User = require("../models/User");

const protect = async (req, res, next) => {
    // Automatically find the first user (guest admin) to bypass login
    try {
        const guestUser = await User.findOne({ email: 'demo@example.com' });
        if (guestUser) {
            req.user = guestUser;
            return next();
        }
        res.status(500).json({ message: "Guest system unavailable - Please run seed script" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        next(); // Allow all roles in guest mode
    };
};

module.exports = { protect, authorize };
