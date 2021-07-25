const initState = {
  error: null,
  isLoading: false,
  createSuccess: false
};

const createUser = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'CREATE_USER_START':
      return { ...state, isLoading: true };
    case 'CREATE_USER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        createSuccess: true,
        error: null 
      };
    case 'CREATE_USER_ERROR':
      return { ...state, ...payload, isLoading: false };
    case 'INIT_USER':
      return { ...state, ...payload, error: null };
    default:
      return state;
  }
};

export default createUser;
