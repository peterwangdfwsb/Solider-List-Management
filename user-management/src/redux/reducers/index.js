import { combineReducers } from 'redux';
import users from './users';
import createUser from './createuser';
import editUser from './edituser';
import getUser from './getuser';
import superiors from './superiors';

const reducer = combineReducers({
  users,
  createUser,
  editUser,
  getUser,
  superiors,
});

export default reducer;
