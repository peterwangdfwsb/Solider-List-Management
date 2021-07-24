const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); 
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
  });

// Routes
app.use('/api/users', router);

router.get(
    '/:pageSize/:pageNumber/:sortType/:searchText/:superiorId',
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
          sortType: req.params.sortType,
          searchText: req.params.searchText,
          superiorId: req.params.superiorId
        };
  
        const users = await UserModel.getUsers(query);
        res.status(200).json(users);
      } catch (err) {
        res.status(404).json({ error: 'No user found: ' + err });
      }
    }
  );

const UserModel = require('./models/user');
router.get('/:userId', async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.userId);
      res.status(200).json({
        code: 0,
        data: { user }
      });
    } catch (err) {
      res.status(404).json({ error: 'No user found by this id: ' + err });
    }
  });



  

// Get Valid superior choices (Loop Check)
const UserController = require('./controllers/user');
router.get('/loopsafe/:userId', async (req, res) => {
    try {
      // res an array
      const validSuperiors = await UserController.getValidSuperiors(
        req.params.userId
      );
      res.status(200).json({
        code: 0,
        data: { validSuperiors }
      });
    } catch (err) {
      res
        .status(404)
        .json({ error: 'No valid superiors found by this id: ' + err });
    }
  });
  
// Create user
router.post('/', async (req, res) => {
    try {
      const user = await UserController.createNewUser(req.body);
      res.status(200).json({
        code: 0,
        data: { user }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create: ' + err });
    }
  });
  
  // Edit user
router.put('/:userId', async (req, res) => {
    try {
      const user = await UserController.updateUser(req.params.userId, req.body);
      res.status(200).json({
        code: 0,
        data: { user }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update: ' + err });
    }
  });
  
  // Delete user
  router.delete('/:userId', async (req, res) => {
    try {
      const user = await UserController.deleteUser(req.params.userId);
      res.status(200).json({
        code: 0,
        data: { user }
      });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete' + err });
    }
  });
  



mongoose.connect('mongodb+srv://peter:abc@ustsvdemo.t5qj9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true ,
        useUnifiedTopology:true
    })
  .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log('Magic happens on port ' + PORT)}
);

