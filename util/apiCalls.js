const { default: axios } = require('axios');

exports.addSource = async (userId, url) => {
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
                    [userJson.data.id]: testingUser.current_secret_token,
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