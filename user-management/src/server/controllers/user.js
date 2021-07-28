const UserModel = require('../models/user');

// LOGIC FOR RELATIONS
// CREATE WITH & WITHOUT SUPERIOR
const createUserWithoutSuperior = async userData => {
  try {
    userData = { ...userData, superior: null, superiorname: null };
    return await UserModel.createUser(userData);
  } catch (err) {
    throw new Error(err);
  }
};

const createUserWithSuperior = async userData => {
  try {
    const user = await UserModel.createUser(userData);
    await UserModel.addUserSubordinates(userData.superior, user._id);
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const createNewUser = async userData => {
  try {
    if (!userData.superior || !userData.superiorname) {
      return await createUserWithoutSuperior(userData);
    } else {
      return await createUserWithSuperior(userData);
    }
  } catch (err) {
    throw new Error(err);
  }
};

// UPDATE WITH & WITHOUT SUPERIOR
const updateUserNoSupUpdate = async (userId, userData) => {
  try {
    return await UserModel.updateUserById(userId, userData);
  } catch (err) {
    throw new Error(err);
  }
};

const updateUserNoSupToHasSup = async (userId, userData) => {
  try {
    await UserModel.addUserSubordinates(userData.superior, userId);
    return await UserModel.updateUserById(userId, userData);
  } catch (err) {
    throw new Error(err);
  }
};

const updateUserHasSupToNoSup = async (userId, superiorId, userData) => {
  try {
    await UserModel.deleteUserSubordinates(superiorId, userId);
    return await UserModel.updateUserById(userId, userData);
  } catch (err) {
    throw new Error(err);
  }
};

const updateUserHasSupAToHasSupB = async (userId, superiorId, userData) => {
  try {
    await UserModel.addUserSubordinates(userData.superior, userId);
    await UserModel.deleteUserSubordinates(superiorId, userId);
    return await UserModel.updateUserById(userId, userData);
  } catch (err) {
    throw new Error(err);
  }
};

const updateUser = async (userId, userData) => {
  try {
    const user = await UserModel.getUserById(userId);

    if (user.name.toString() !== userData.name.toString()) {
      if (user.directsubordinates.length > 0) {
        await UserModel.updateUserSuperior(userId, userId, userData.name);
      }
    }

    if (!user.superior) {
      if (!userData.superior) {
        return await updateUserNoSupUpdate(userId, userData);
      } else {
        return await updateUserNoSupToHasSup(userId, userData);
      }
    } else {
      if (!userData.superior) {
        return await updateUserHasSupToNoSup(
          userId,
          user.superior,
          userData
        );
      } else {
        if (user.superior.toString() === userData.superior.toString()) {
          return await updateUserNoSupUpdate(userId, userData);
        } else {
            return await updateUserHasSupAToHasSupB( 
            userId,
            user.superior,
            userData
          );
        }
      }
    }
  } catch (err) {
    throw new Error(err);
  }
};

// DELETE WITH & WITHOUT SUPERIOR
const deleteUserNoSupNoSub = async userId => {
  try {
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteUserNoSupHasSub = async userId => {
  try {
    await UserModel.deleteUserSuperior(userId);
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteUserHasSupNoSub = async (userId, superiorId) => {
  try {
    await UserModel.deleteUserSubordinates(superiorId, userId);
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteUserHasSupHasSub = async (
  userId,
  superiorId,
  superiorName,
  directsubordinates
) => {
  try {
    await UserModel.transferUserSubordinates(superiorId, directsubordinates);
    await UserModel.deleteUserSubordinates(superiorId, userId);
    await UserModel.updateUserSuperior(userId, superiorId, superiorName);
    return await UserModel.deleteUserById(userId);
  } catch (err) {
    throw new Error(err);
  }
};

const deleteUser = async userId => {
  try {
    const user = await UserModel.getUserById(userId);

    if (!user.superior) {
      if (user.directsubordinates.length === 0) {
        return await deleteUserNoSupNoSub(userId);
      } else {
        return await deleteUserNoSupHasSub(userId);
      }
    } else {
      if (user.directsubordinates.length === 0) {
        return await deleteUserHasSupNoSub(userId, user.superior);
      } else {
          return await deleteUserHasSupHasSub(
          userId,
          user.superior,
          user.superiorname,
          user.directsubordinates
        );
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const getValidSuperiors = async userId => {
  try {
    const allUsers = await UserModel.getAllUsers();
    const subordinates = await UserModel.getSubordinates(userId);
    const subList = subordinates.map(id => id.toString());
    const invalidList = [...subList, userId];
    return allUsers.filter(
      user => invalidList.indexOf(user._id.toString()) === -1
    );
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};


module.exports = {
  createNewUser,
  deleteUser,
  updateUser,
  getValidSuperiors
};
