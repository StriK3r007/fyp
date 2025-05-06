const jwt = require('jsonwebtoken');
const config = require('config'); // Make sure you have a config file to store your JWT_SECRET and JWT_EXPIRATION time

/**
 * Generates a JWT token for a given user.
 * @param {Object} user - The user object to encode into the JWT.
 * @param {string} user.id - The user ID.
 * @param {string} user.role - The user role (admin, driver, user, super-admin).
 * @returns {string} - The generated JWT token.
 */
// function generateToken(user) {
//     const payload = {
//         id: user._id,  // The unique user ID
//         role: user.role // The user's role (admin, driver, user, super-admin)
//     };

//     const options = {
//         expiresIn: config.get('jwtExpiration') // Set expiration time for the token (e.g., 1 hour)
//     };

//     // Sign the payload with the secret key stored in the config file
//     const token = jwt.sign(payload, config.get('jwtSecret'), options);
//     return token;
// }

// exports.generateToken = (payload) => {
//     return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
// };
// module.exports = { generateToken };

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifies a given JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {Object|false} - Decoded user payload if token is valid, false if invalid.
 */
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        return decoded;  // The decoded payload (user ID and role)
    } catch (err) {
        return false;  // Return false if the token is invalid or expired
    }
}

/**
 * Middleware to protect routes based on user roles.
 * This will allow or deny access to routes based on the user's role.
 * @param {Array} allowedRoles - An array of roles allowed to access the route (e.g., ['admin', 'super-admin']).
 * @returns {Function} - Express middleware function.
 */
function authorize(allowedRoles) {
    return (req, res, next) => {
        // Get the token from the Authorization header (Bearer token)
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }

        // Check if the user's role is authorized
        if (allowedRoles.includes(decoded.role)) {
            req.user = decoded; // Attach user info to the request
            next(); // Proceed to the next middleware/route handler
        } else {
            return res.status(403).json({ message: 'Access denied. You do not have permission to access this resource.' });
        }
    };
}

module.exports = {
    generateToken,
    verifyToken,
    authorize
};
