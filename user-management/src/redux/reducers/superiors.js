const initState = {
  superiorList: [],
  error: null,
  isLoading: false
};

const superiors = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_SUPERIOR_LIST_START':
      return { ...state, isLoading: true };
    case 'SET_SUPERIOR_LIST_SUCCESS':
      return {
        ...state,
        superiorList: payload,
        isLoading: false
      };

    case 'SET_SUPERIOR_LIST_ERROR':
      return { ...state, ...payload, isLoading: false };
    default:
      return state;
  }
};

export default superiors;
