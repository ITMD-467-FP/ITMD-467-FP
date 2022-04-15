const { default: axios } = require('axios');

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

