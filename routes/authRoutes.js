const express = require('express');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.post('/createUser', authController.createUser);
router.get('/getUsers', authController.getUsers);
router.delete('/deleteUser', authController.deleteUser);
router.get('/getUser/:email', authController.getUser);
router.get('/getFamilyMembers/:email', authController.getFamilyMembers);
router.put('/updateUser', authController.updateUser);
router.get('/userByToken/:token', authController.userByToken);

module.exports = router;