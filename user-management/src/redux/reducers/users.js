const initState = {
  users: [],
  error: null,
  deleteError: null,
  isLoading: false,
  sortDecision: 'None',
  config: { pageSize: 7, pageNumber: 1, searchText: '__NO_SEARCH_TEXT__', superiorId: '__NO_SUPERIOR_ID__' },
  uploadImg: false
};

const users = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_USER_LIST_START':
      return { ...state, isLoading: true };
    case 'SET_USER_LIST_SUCCESS':
      state.config.pageNumber++;
      return {
        ...state,
        ...payload,
        isLoading: false
      };
    case 'SET_USER_LIST_ERROR':
      return { ...state, ...payload, isLoading: false };
    case 'DELETE_USER_START':
      return { ...state, isLoading: true };
    case 'DELETE_USER_ERROR':
      return { ...state, ...payload, isLoading: false };
    case 'DELETE_USER_SUCCESS':
      return {
        ...state,
        users: payload,
        isLoading: false
      };
    case 'CHANGE_SEARCH_TEXT':
      state.config.searchText = payload.searchText;
      state.config.pageNumber = 1;
      return state;

    case 'SORT_DECISION':
      state.config.sortDecision = payload.sortDecision;
      state.config.pageNumber = 1;
      return state;
    
    case 'UPLOAD_IMG':
      return {...state, uploadImg: true};

    default:
      return state;
  }
};

export default users;
