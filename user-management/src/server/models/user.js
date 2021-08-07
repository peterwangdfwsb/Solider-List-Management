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
  const { pageSize, pageNumber, searchText, superiorId, sortDecision } = params;
  
  // FOR SEARCH PART
  let regex = new RegExp(searchText, 'gim');
  let query = { $or: [ { name: regex } ] };

  if (superiorId) {
    query = { ...query, $and: [{ superior: superiorId }]};
  }

  // FOR SORT PART
  const sortType = {None: {}, Up: {name: 1}, Down: {name: -1}}
  const options = { sort: sortType[sortDecision], lean: true, page: pageNumber, limit: pageSize };
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
    let bfs = [];
    let bfs_1 = [];
    
   //if (sub.directsubordinates.length === 0) return sub;
   for (let i = 0; i < sub.directsubordinates.length; i++) {
        let ds = await getUserById(subArr[i]);
        let dsArr = ds.directsubordinates;
        subArr = [...subArr, ...dsArr];
        bfs = [...dsArr];

    }

    if (bfs) {
      for (let j = 0; j < bfs.length; j++) {
        let es = await getUserById(bfs[j]);
        let esArr = es.directsubordinates;
        subArr = [...subArr, ...esArr];
        bfs_1 = [...esArr];
      }
    }

    if (bfs_1) {
      for (let k = 0; k < bfs_1.length; k++) {
        let fs = await getUserById(bfs_1[k]);
        let fsArr = fs.directsubordinates;
        subArr = [...subArr, ...fsArr];
      }

    }


    console.log(subArr);
    console.log(bfs_1);
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
