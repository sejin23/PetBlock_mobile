import * as types from './actionTypes';
import { URL } from '../config';

export const loginRequest = () => ({
    type: types.LOGIN_REQUEST
})

export const loginSuccess = data => ({
    type: types.LOGIN_SUCCESS,
    info: data
})

export const loginFailure = () => ({
    type: types.LOGIN_FAILURE
})

export const logout = () => ({
    type: types.LOGOUT
})

export const fetchPetInfo = (id) => {
    return dispatch => {
        fetch(URL + 'auth/users/petInfo/download', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: id
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.length > 0) {
                dispatch(loadPet(res));
            }
        })
    }
}

export const addPetWithImg = (id, pet) => {
    return dispatch => {
        fetch(URL + 'auth/users/petInfo/uploadExistingImg', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: id,
                newPet: pet
            })
        })
        .then(response => response.json())
        .then(res => {
            if(res.result === 'success')
                dispatch(addPet(pet));
        })
    }
}

export const addPetInfo = (image, id, pet) => {
    return dispatch => {
        if(!image) {
            fetch(URL + 'auth/users/petInfo/upload', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: id,
                    newPet: pet
                })
            })
            .then(response => response.json())
            .then(res => {
                if(res.result === 'success') {
                    dispatch(addPet(pet));
                }
            })
            .catch(err => console.log('Pet data upload error : ' + err));
        } else {
            var data = new FormData();
            var petInfo = pet;
            data.append('petImage', {
                name: 'pets.jpg',
                uri: image,
                type: 'image/jpeg'
            });
            petInfo.email = id;
            data.append('petData', JSON.stringify(petInfo));

            fetch(URL + 'auth/users/petInfo/uploadWithImage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                body: data
            })
            .then(response => response.json())
            .then(res => {
                if(res.result === 'success') {
                    let newData = pet;
                    newData.img = res.src;
                    dispatch(addPet(newData));
                }
            })
            .catch(err => console.log('Image upload error : ' + err));
        }
    }
}

export const deletePetInfo = (image, id, name) => {
    return dispatch => {
        if(image === '') {
            fetch(URL + 'auth/users/petInfo/drop', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: id,
                    petName: name
                })
            })
            .then(response => response.json())
            .then(res => {
                if(res.result === 'success') {
                    dispatch(deletePet(name));
                }
            })
        } else {
            fetch(URL + 'auth/users/petInfo/dropWithImg', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    img: image,
                    email: id,
                    petName: name
                })
            })
            .then(response => response.json())
            .then(res => {
                if(res.result === 'success') {
                    dispatch(deletePet(name))
                }
            })
        }
    }
}

export const loadPet = data => ({
    type: types.LOAD_PET_INFO,
    loaded: data
})

export const addPet = data => ({
    type: types.ADD_PET_INFO,
    data: data
})

export const deletePet = name => ({
    type: types.DEL_PET_INFO,
    name: name
})

export const startEditPet = () => ({
    type: types.START_EDIT_PET
})

export const cancelEditPet = () => ({
    type: types.CANCEL_EDIT_PET
})