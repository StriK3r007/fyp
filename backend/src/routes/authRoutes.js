const express = require('express');
const { registerUser, loginUser, updateUser, deleteUser, getLoggedInUser, getAllUsers, changePassword } = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Make sure the path to your middleware is correct



// router.post('/register', register);
// router.post('/login', login);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.get('/me', authMiddleware, getLoggedInUser); // New route to get logged-in user
router.get('/users', getAllUsers); // Only for admins ideally
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
