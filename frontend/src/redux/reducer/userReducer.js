export function userReducer(state = {}, action) {
    switch (action.type) {
        case "LOG_IN": {
            return {
                ...state,
                ...action.payload,
            };
        }
        case "LOG_OUT": {
            return {
                ...state,
                ...action.payload,
            };
        }

        default:
            return state;
    }
}
