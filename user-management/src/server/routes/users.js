const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const UserController = require('../controllers/user');


// CREATE
router.post('/', async (req, res) => {
  try {
    const user = await UserController.createNewUser(req.body);
    res.status(200).json({ data: { user } });
  } catch (err) {
    res.status(500).json({ 'Create Failed :': err });
  }
});

// EDIT
router.put('/:userId', async (req, res) => {
  try {
    const user = await UserController.updateUser(req.params.userId, req.body);
    res.status(200).json({ data: { user } });
  } catch (err) {
    res.status(500).json({ 'Update Failed:': err });
  }
});

// DELETE
router.delete('/:userId', async (req, res) => {
  try {
    const user = await UserController.deleteUser(req.params.userId);
    res.status(200).json({ data: { user } });
  } catch (err) {
    res.status(500).json({ 'Delete Failed': err });
  }
});


// GET ALL USERS & ID
router.get(
  '/:pageSize/:pageNumber/:searchText/:superiorId/:sortDecision',
  async (req, res) => {
    try {
      if (req.params.searchText === '__NO_SEARCH_TEXT__') {
        req.params.searchText = '';
      }
      if (req.params.superiorId === '__NO_SUPERIOR_ID__') {
        req.params.superiorId = null;
      }
      const query = { 
        pageSize: req.params.pageSize, 
        pageNumber: req.params.pageNumber, 
        searchText: req.params.searchText, 
        superiorId: req.params.superiorId,
        sortDecision: req.params.sortDecision 
      };
      const users = await UserModel.getUsers(query);
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json({ 'No Users: ': err });
    }
  }
);


router.get('/:userId', async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.userId);
    res.status(200).json({ data: { user } });
  } catch (err) {
    res.status(404).json({ 'No User ID: ': err });
  }
});

// LOOP CHECK
router.get('/loopsafe/:userId', async (req, res) => {
  try {
      const validSuperiors = await UserController.getValidSuperiors(
      req.params.userId
    );
    res.status(200).json({ data: { validSuperiors } });
  } catch (err) {
    res.status(404).json({ 'No Valid Superiors: ': err });
  }
});

module.exports = router;
