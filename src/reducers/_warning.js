// -- Constants ------------------------------------------------------------- //
const WARNING_PARSE = 'warning/WARNING_PARSE';
const WARNING_SHOW = 'warning/WARNING_SHOW';
const WARNING_HIDE = 'warning/WARNING_HIDE';
const WARNING_CLEAR = 'warning/WARNING_CLEAR';

// -- Actions --------------------------------------------------------------- //

export const warningShow = warning => (dispatch, getState) => {
  dispatch({ type: WARNING_PARSE });
  const warnings = getState().warning.active;
  const isActive = warnings.filter(activeWarning => activeWarning.key === warning.key).length;
  if (!isActive) {
    warnings.push(warning);
  }
  dispatch({ type: WARNING_SHOW, payload: warnings });
};

export const warningHide = key => (dispatch, getState) => {
  dispatch({ type: WARNING_PARSE });
  const warnings = getState().warning.active;
  warnings.filter(warning => warning.key === key);
  dispatch({ type: WARNING_SHOW, payload: warnings });
};

export const warningClear = () => dispatch => dispatch({ type: WARNING_CLEAR });

// -- Reducer --------------------------------------------------------------- //
const INITIAL_STATE = {
  show: true,
  active: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WARNING_PARSE:
      return {
        ...state,
        show: false
      };
    case WARNING_SHOW:
    case WARNING_HIDE:
      return {
        ...state,
        show: true,
        active: action.payload
      };
    case WARNING_CLEAR:
      return { ...state, show: false, active: [] };
    default:
      return state;
  }
};
