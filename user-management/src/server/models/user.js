const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rank: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  startdate: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  superiorname: {
    type: String
  },
  superior: {
    type: Schema.Types.ObjectId
  },
  directsubordinates: [Schema.Types.ObjectId]
});


// DATABASE LOGIC

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('user', UserSchema);

const getAllUsers = async () => {
  let allUsers = User.find({});
  return await allUsers.catch(err => {
    throw new Error('getAllUsers Errors', err);
  });
};

const getUsers = async params => {
  const { pageSize, pageNumber, searchText, superiorId } = params;
  
  // FOR SEARCH PART
  let regex = new RegExp(searchText, 'gim');
  let query = { $or: [ { name: regex } ] };

  if (superiorId) {
    query = { ...query, $and: [{ superior: superiorId }]};
  }

  // FOR SORT PART
  const options = { sort: { name: 1 }, lean: true, page: pageNumber, limit: pageSize };
  let architecture = User.paginate(query, options);

  return await architecture.catch(err => {
    throw new Error('getUsers Error', err);
  });
};

const getUserById = async userId => {
  return await User.findOne({ _id: userId }).catch(err => {
    throw new Error(`getUserById in ${userId}`, err);
  });
};

const getSubordinates = async userId => {
  try {
    let sub = await getUserById(userId);
    let subArr = sub.directsubordinates;
    if (sub.directsubordinates.length === 0) return [];
    for (let i = 0; i < sub.length; i++) {
      let ds = await getSubordinates(sub[i]);
      let dsArr = ds.directsubordinates;
      subArr = [...subArr, ...dsArr];
    }
    return subArr;
  } catch (err) {
    throw new Error('getSubordinates Error', err);
  }
};

const createUser = async userData => {
  const newUser = new User({
    name: userData.name,
    rank: userData.rank,
    sex: userData.sex,
    startdate: userData.startdate,
    phone: userData.phone,
    email: userData.email,
    avatar: userData.avatar,
    superior: userData.superior,
    superiorname: userData.superiorname
  });
  return await newUser.save().catch(err => {
    throw new Error('createUser Error', err);
  });
};

const addUserSubordinates = async (userId, dsId) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { directsubordinates: dsId } },
    { new: true }
  ).catch(err => {
    throw new Error('addUserSubordinates Error', err);
  });
};

const transferUserSubordinates = async (userId, ds) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $push: { directsubordinates: { $each: [...ds] } } },
    { new: true }
  ).catch(err => {
    throw new Error('transferUserSubordinates Error', err);
  });
};

const deleteUserSubordinates = async (userId, dsId) => {
  return await User.findOneAndUpdate(
    { _id: userId },
    { $pull: { directsubordinates: dsId } },
    { new: true }
  ).catch(err => {
    throw new Error('deleteUserSubordinates Error', err);
  });
};

const deleteUserSuperior = async supId => {
  return await User.updateMany(
    { superior: supId },
    { $set: { superior: null, superiorname: null } },
    { new: true }
  ).catch(err => {
    throw new Error('deleteUserSuperior Error', err);
  });
};

const deleteUserById = async userId => {
  return await User.findByIdAndDelete({ _id: userId }).catch(err => {
    throw new Error(`deleteUserById Error: ${userId}`, err);
  });
};

const updateUserById = async (userId, userData) => {
  if (userData.superior === '' || userData.superiorname === '') {
    userData.superior = null;
    userData.superiorname = null;
  }
  return await User.findOneAndUpdate(
    { _id: userId },
    { $set: { 
      name: userData.name, 
      rank: userData.rank, 
      sex: userData.sex, 
      startdate: userData.startdate, 
      phone: userData.phone, 
      email: userData.email,
      avatar: userData.avatar,
      superior: userData.superior,
      superiorname: userData.superiorname
      }
    },
    { new: true }
  ).catch(err => {
    throw new Error(`updateUserById Error: ${userId}`, err);
  });
};

const updateUserSuperior = async (supId, newSupId, newSupName) => {
  return await User.updateMany(
    { superior: supId },
    { $set: { superior: newSupId, superiorname: newSupName } },
    { new: true }
  ).catch(err => {
    throw new Error('updateUserSuperior Error', err);
  });
};


module.exports = {
  getUsers,
  getUserById,
  createUser,
  addUserSubordinates,
  deleteUserSubordinates,
  deleteUserSuperior,
  deleteUserById,
  transferUserSubordinates,
  updateUserById,
  updateUserSuperior,
  getAllUsers,
  getSubordinates
};
