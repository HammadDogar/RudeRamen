import axios from "axios";
import { APP_SETTINGS } from "../../config";


export function userLogin(userData) {
    userData = { ...userData }
    return axios.post(APP_SETTINGS.API_PATH.LOGIN.login, userData)
}