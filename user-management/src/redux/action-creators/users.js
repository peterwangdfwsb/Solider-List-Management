import axios from 'axios';


//CREATE ACTIONS
const createUserStart = () => { return { type: 'CREATE_USER_START', payload: {} }; };
const createUserSuccess = () => { return { type: 'CREATE_USER_SUCCESS' }; };
const createUserError = err => { return { type: 'CREATE_USER_ERROR', payload: { error: err } }; };

export const createUser = userData => dispatch => {
  dispatch(createUserStart());
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (userData.superior) {
    axios
      .get(`http://localhost:5000/api/users/${userData.superior}`)
      .then(res => {
        userData = { ...userData, superiorname: res.data.data.user.name };
        axios
          .post('http://localhost:5000/api/users', userData, config)
          .then(res => {
            dispatch(createUserSuccess());
          })
          .catch(err => dispatch(createUserError(err)));
      })
      .catch(err => dispatch(createUserError(err)));
  } else {
    axios
      .post('http://localhost:5000/api/users', userData, config)
      .then(res => {
        dispatch(createUserSuccess());
      }) 
      .catch(err => dispatch(createUserError(err)));
  }
};

// UPDATE ACTIONS
const editUserStart = () => { return { type: 'EDIT_USER_START', payload: {} }; };
const editUserSuccess = () => { return { type: 'EDIT_USER_SUCCESS' }; };
const editUserError = err => { return { type: 'EDIT_USER_ERROR', payload: { error: err } }; };

export const editUser = (
  id,
  userData,
  initEdit
) => dispatch => {
  dispatch(editUserStart());

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (userData.superior) {
    axios
      .get(`http://localhost:5000/api/users/${userData.superior}`)
      .then(res => {
        userData = { ...userData, superiorname: res.data.data.user.name };
        axios
          .put(`http://localhost:5000/api/users/${id}`, userData, config)
          .then(res => {
            dispatch(editUserSuccess()); 
            initEdit();
          })
          .catch(err => dispatch(editUserError(err)));
      })
      .catch(err => dispatch(editUserError(err)));
  } else {
    userData = { ...userData, superiorname: '' };
    axios
      .put(`http://localhost:5000/api/users/${id}`, userData, config)
      .then(res => {
        dispatch(editUserSuccess()); 
        initEdit();
      })
      .catch(err => dispatch(editUserError(err)));
  }
};

// INIT ACTIONS
export const initEdit = () => dispatch => {
  dispatch({
    type: 'INIT_EDIT',
    payload: {
      avatar:
        'https://s.yimg.com/aah/priorservice/us-army-new-logo-magnet-15.gif',
      name: '',
      sex: '',
      rank: '',
      startdate: '',
      phone: '',
      email: '',
      superior: '',
      editSuccess: false,
      error: null
    }
  });
};

export const initUser = () => dispatch => {
  dispatch({
    type: 'INIT_USER',
    payload: {
      firstname: '',
      lastname: '',
      sex: '',
      age: '',
      password: '',
      createSuccess: false,
      error: null
    }
  });
};

// DELETE ACTIONS
const deleteUserStart = () => { return { type: 'DELETE_USER_START', payload: {} }; };
const deleteUserSuccess = users => { return { type: 'DELETE_USER_SUCCESS', payload: users }; };
const deleteUserError = err => { return { type: 'DELETE_USER_ERROR', payload: { deleteError: err } }; };

export const deleteUser = (id, users) => dispatch => {
  dispatch(deleteUserStart());
  axios
    .delete(`http://localhost:5000/api/users/${id}`)
    .then(() => {
      users = users.filter(user => user._id.toString() !== id.toString());
      dispatch(deleteUserSuccess(users)); 
      const config = {
        pageSize: 7,
        pageNumber: 1,
        searchText: '__NO_SEARCH_TEXT__',
        superiorId: '__NO_SUPERIOR_ID__',
        sortDecision: 'None'
      };
      axios
        .get(
          `http://localhost:5000/api/users/${config.pageSize}/${config.pageNumber}/${config.searchText}/${config.superiorId}/${config.sortDecision}`
        )
        .then(res => {
          config.pageNumber++;
          dispatch(setUserListSuccess(res.data.docs, config));
        })
        .catch(err => dispatch(setUserListError(err)));
    })
    .catch(err => dispatch(deleteUserError(err)));
};


// GET ACTIONS
const getUserStart = () => { return { type: 'GET_USER_START', payload: {} }; };
const getUserSuccess = userData => { return { type: 'GET_USER_SUCCESS', payload: { user: userData } }; };
const getUserError = err => { return { type: 'GET_USER_ERROR', payload: { error: err } }; };

export const getUser = (id, setUserData) => dispatch => {
  dispatch(getUserStart());
  axios
    .get(`http://localhost:5000/api/users/${id}`)
    .then(res => {
      const {
        avatar,
        name,
        sex,
        rank,
        startdate,
        phone,
        email,
        superior,
        superiorname
      } = res.data.data.user;
      const userData = {
        avatar,
        name,
        sex,
        rank,
        startdate,
        phone,
        email,
        superior: superior ? superior : '',
        superiorname: superiorname ? superiorname : ''
      };
      dispatch(getUserSuccess(userData));
      setUserData(userData);
    })
    .catch(err => dispatch(getUserError(err)));
};


export const changeSearchText = query => dispatch => {
  if (!query) query = '__NO_SEARCH_TEXT__';
  dispatch({
    type: 'CHANGE_SEARCH_TEXT',
    payload: { searchText: query }
  });
};

export const getSuperior = id => dispatch => {
  if (!id) return;
  dispatch(setUserListStart());
  const config = {
    pageSize: 7,
    pageNumber: 1,
    searchText: '__NO_SEARCH_TEXT__',
    superiorId: '__NO_SUPERIOR_ID__',
    sortDecision: 'None'
  };
  axios
    .get(`http://localhost:5000/api/users/${id}`)
    .then(res => {
      dispatch(setUserListSuccess([res.data.data.user], config));
    })
    .catch(err => dispatch(setUserListError(err)));
};

export const getSubordinates = (id, len) => dispatch => {
  if (len === 0) return;
  dispatch(setUserListStart());
  const config = {
    pageSize: 7,
    pageNumber: 1,
    searchText: '__NO_SEARCH_TEXT__',
    superiorId: id,
    sortDecision: 'None'
  };
  axios
    .get(
      `http://localhost:5000/api/users/${config.pageSize}/${
        config.pageNumber
      }/${config.searchText}/${config.superiorId}/${config.sortDecision}`
    )
    .then(res => {
      console.log('getSup: ', res.data);
      config.pageNumber++;
      dispatch(setUserListSuccess(res.data.docs, config));
    })
    .catch(err => dispatch(setUserListError(err)));
};

const setUserListStart = () => { return { type: 'SET_USER_LIST_START', payload: { error: null, deleteError: null } }; };
const setUserListSuccess = (data, config) => { return { type: 'SET_USER_LIST_SUCCESS', payload: { users: data, config } }; };
const setUserListError = err => { return { type: 'SET_USER_LIST_ERROR', payload: { error: err } }; };

export const setUserList = config => dispatch => {
  dispatch(setUserListStart());
  const { pageSize, pageNumber, searchText, superiorId, sortDecision } = config;
  axios
    .get(
      `http://localhost:5000/api/users/${pageSize}/${pageNumber}/${searchText}/${superiorId}/${sortDecision}`
    )
    .then(res => {
      dispatch(setUserListSuccess(res.data.docs, config));
    })
    .catch(err => dispatch(setUserListError(err)));
};

const setSuperiorListStart = () => {
  return {
    type: 'SET_SUPERIOR_LIST_START',
    payload: { error: null } 
  };
};

const setSuperiorListSuccess = users => {
  return {
    type: 'SET_SUPERIOR_LIST_SUCCESS',
    payload: users
  };
};

const setSuperiorListError = err => {
  return {
    type: 'SET_SUPERIOR_LIST_ERROR',
    payload: { error: err } 
  };
};

export const setSuperiorList = id => dispatch => {
  dispatch(setSuperiorListStart());
  axios
    .get(`http://localhost:5000/api/users/loopsafe/${id}`)
    .then(res => {
      dispatch(setSuperiorListSuccess(res.data.data.validSuperiors));
    })
    .catch(err => dispatch(setSuperiorListError(err)));
};

export const infiniteScrolling = (config, users) => dispatch => {
  const { pageSize, pageNumber, searchText, superiorId, sortDecision } = config;
  axios
    .get(
      `http://localhost:5000/api/users/${pageSize}/${pageNumber}/${searchText}/${superiorId}/${sortDecision}`
    )
    .then(res => {
      dispatch(setUserListSuccess(users.concat(res.data.docs), config));
    })
    .catch(err => dispatch(setUserListError(err)));
};

export const fetchUsers = () => dispatch => {
  dispatch(setUserListStart());
  const config = {
    pageSize: 7,
    pageNumber: 1,
    sortDecision: 'None',
    searchText: '__NO_SEARCH_TEXT__',
    superiorId: '__NO_SUPERIOR_ID__'
  };
  axios
    .get(
      `http://localhost:5000/api/users/${config.pageSize}/${config.pageNumber}/${config.searchText}/${config.superiorId}/${sortDecision}`
    )
    .then(res => {
      config.pageNumber++;
      dispatch(setUserListSuccess(res.data.docs, config));
    })
    .catch(err => dispatch(setUserListError(err)));
};

export const sortDecision = decision => dispatch => {
  dispatch({
    type: 'SORT_DECISION',
    payload: { sortDecision: decision }
  });
};


