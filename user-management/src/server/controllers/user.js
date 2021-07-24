const UserModel = require('../models/user');

// service
const createUserWithoutSuperior = async userData => {
    try {
      // Unify data format
      userData = { ...userData, superior: null, superiorname: null };
      return await UserModel.createUser(userData);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create new user in service: ' + err);
    }
  };
  
  const createUserWithSuperior = async userData => {
    try {
      const user = await UserModel.createUser(userData);
      // Must create user then we can get user's id
      await UserModel.addUserSubordinates(userData.superior, user._id);
      return user;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to create new user in service: ' + err);
    }
  };
  
  // -------------------
  const updateUserNoSupUpdate = async (userId, userData) => {
    try {
      // console.log(userData);
      return await UserModel.updateUserById(userId, userData);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update user in service: ' + err);
    }
  };
  
  const updateUserNoSupToHasSup = async (userId, userData) => {
    try {
      await UserModel.addUserSubordinates(userData.superior, userId);
      return await UserModel.updateUserById(userId, userData);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update user in service: ' + err);
    }
  };
  
  const updateUserHasSupToNoSup = async (userId, superiorId, userData) => {
    try {
      // const ds = 0;
      await UserModel.deleteUserSubordinates(superiorId, userId);
      return await UserModel.updateUserById(userId, userData);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update user in service: ' + err);
    }
  };
  
  const updateUserHasSupAToHasSupB = async (userId, superiorId, userData) => {
    try {
      await UserModel.addUserSubordinates(userData.superior, userId);
      await UserModel.deleteUserSubordinates(superiorId, userId);
      return await UserModel.updateUserById(userId, userData);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to update user in service: ' + err);
    }
  };
  
  // -------------------
  const deleteUserNoSupNoSub = async userId => {
    try {
      return await UserModel.deleteUserById(userId);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to delete user in service: ' + err);
    }
  };
  
  const deleteUserNoSupHasSub = async userId => {
    try {
      await UserModel.deleteUserSuperior(userId);
      return await UserModel.deleteUserById(userId);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to delete user in service: ' + err);
    }
  };
  
  const deleteUserHasSupNoSub = async (userId, superiorId) => {
    try {
      // const ds = 0;
      await UserModel.deleteUserSubordinates(superiorId, userId);
      return await UserModel.deleteUserById(userId);
    } catch (err) {
      console.log(err);
      throw new Error('Failed to delete user in service: ' + err);
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
      console.log(err);
      throw new Error('Failed to delete user in service: ' + err);
    }
  };
  
  const getValidSuperiors = async userId => {
    try {
      const allUsers = await UserModel.getAllUsers();
      const subordinates = await UserModel.getSubordinates(userId);
      const subList = subordinates.map(id => id.toString());
      const invalidList = [...subList, userId];
      // _id is an object, not a string, use immutable compare
      return allUsers.filter(
        user => invalidList.indexOf(user._id.toString()) === -1
      );
    } catch (err) {
      console.log(err);
      throw new Error('Failed to get valid superior in service: ' + err);
    }
  };


// controllers
const createNewUser = async userData => {
  try {
    if (!userData.superior || !userData.superiorname) {
      return await createUserWithoutSuperior(userData);
    } else {
      return await createUserWithSuperior(userData);
    }
  } catch (err) {
    console.log(err);
    throw new Error('Failed to create new user in controller: ' + err);
  }
};

const deleteUser = async userId => {
  try {
    const user = await UserModel.getUserById(userId);

    if (!user.superior) {
      if (user.directsubordinates.length === 0) {
        // No Sup && No Sub
        return await deleteUserNoSupNoSub(userId);
      } else {
        // No Sup but Has Sub
        return await deleteUserNoSupHasSub(userId);
      }
    } else {
      if (user.directsubordinates.length === 0) {
        // Has Sup but No Sub
        return await deleteUserHasSupNoSub(userId, user.superior);
      } else {
        // Has Sup && Has Sub
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
    throw new Error('Failed to delete user in controller: ' + err);
  }
};

const updateUser = async (userId, userData) => {
  try {
    const user = await UserModel.getUserById(userId);

    // Name check
    if (user.name.toString() !== userData.name.toString()) {
      if (user.directsubordinates.length > 0) {
        await UserModel.updateUserSuperior(userId, userId, userData.name);
      }
    }

    if (!user.superior) {
      if (!userData.superior) {
        // No Sup -> No Sup
        return await updateUserNoSupUpdate(userId, userData);
      } else {
        // No Sup -> Has Sup
        return await updateUserNoSupToHasSup(userId, userData);
      }
    } else {
      if (!userData.superior) {
        // Has Sup -> No Sup
        return await updateUserHasSupToNoSup(
          userId,
          user.superior,
          userData
        );
      } else {
        if (user.superior.toString() === userData.superior.toString()) {
          // Has Sup A -> Has Sup A
          return await updateUserNoSupUpdate(userId, userData);
        } else {
          // Has Sup A -> Has Sup B
          return await updateUserHasSupAToHasSupB(
            userId,
            user.superior,
            userData
          );
        }
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error('Failed to update user in controller: ' + err);
  }
};

module.exports = {
  createNewUser,
  deleteUser,
  updateUser,
  createUserWithoutSuperior,
  createUserWithSuperior,
  deleteUserNoSupNoSub,
  deleteUserNoSupHasSub,
  deleteUserHasSupNoSub,
  deleteUserHasSupHasSub,
  updateUserNoSupUpdate,
  updateUserNoSupToHasSup,
  updateUserHasSupToNoSup,
  updateUserHasSupAToHasSupB,
  getValidSuperiors
};
