const { default: axios } = require('axios');

const server = 'http://localhost:8080';

exports.addSource = async (userId, url, current_secret_token) => {
    return new Promise((resolve, reject) => {
        try {
            axios( { 
                method: "post",
                url: `${server}/addSource`,
                data: {
                    userId: userId,
                    sourceUrl: url
                },
                headers: {
                    [userId]: current_secret_token,
                    "Content-Type": "application/json"
                }
            }).then((JSON) => {
                resolve(JSON.data);
            });
        } catch (error) {
            console.log(error);
        }
    });
}

exports.newUser = async (email, password, fname, lname) => {
    return new Promise((resolve, reject) => {
        try {
            axios( { //Create new user
                method: "post",
                url: `${server}/newUser`,
                data: {
                    email: email,
                    password: password,
                    fname: fname,
                    lname: lname
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((JSON) => {
                resolve(JSON.data);
            });
        } catch (error) {
            console.log(error);
        }
    });
}

exports.loginUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        try {
            axios( { //Create new user
                method: "get",
                url: `${server}/userLogin`,
                data: {
                    email: email,
                    password: password
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }).then((JSON) => {
                resolve(JSON.data);
            });
        } catch (error) {
            console.log(error);
        }
    });
}