import { combineReducers } from 'redux';
import * as types from '../actions/actionTypes';

const userDefaultState = {
    isLoggedIn: false,
    fetchingUpdate: false,
    info: {}
}

const petDefaultState = {
    myPet: [],
    editState: false,
}

const userReducer = (state = userDefaultState, action) => {
    switch(action.type) {
        case types.LOGIN_REQUEST:
            return {
                ...state,
                fetchingUpdate: true
            };
        case types.LOGIN_SUCCESS:
            return {
                fetchingUpdate: false,
                isLoggedIn: true,
                info: action.info
            };
        case types.LOGIN_FAILURE:
            return {
                ...state,
                fetchingUpdate: false
            };
        case types.LOGOUT:
            return userDefaultState;
        default:
            return state;
    }
}

const petReducer = (state = petDefaultState, action) => {
    switch(action.type) {
        case types.LOAD_PET_INFO:
            return {
                ...state,
                myPet: action.loaded
            }
        case types.ADD_PET_INFO:
            return {
                ...state,
                myPet: [...state.myPet, action.data],
                editState: false
            };
        case types.DEL_PET_INFO:
            return {
                ...state,
                myPet: state.myPet.filter(val => val.name !== action.name)
            };
        case types.START_EDIT_PET:
            return {
                ...state,
                editState: true
            }
        case types.CANCEL_EDIT_PET:
            return {
                ...state,
                editState: false
            }
        default:
            return state;
    }
}

export default combineReducers({
    user: userReducer,
    pet: petReducer
});