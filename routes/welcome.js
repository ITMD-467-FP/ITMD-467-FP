module.exports = function(app) {  //receiving "app" instance
    app.route('/welcome')
        .get(getAPI)
        .post(postAPI);
}

function getAPI(req, res){
    var myObj = {
        name: req.query.name,
        message: `Welcome to the cool kids club, ${req.query.name}`
    }
    res.json(myObj);
}

function postAPI(req, res){} //This needs to be here. Don't ask me.