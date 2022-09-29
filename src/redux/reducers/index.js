import { combineReducers } from "redux";
import { userReducer } from "./authentication";


export const rootReducer = combineReducers({
    user: userReducer,
});
