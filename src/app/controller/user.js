const userService = require("../services/userService");
class User {

    constructor() { }

    functions(req, res) {

        function limited() {
            userService.limit(req.limited, req.start)
            .then((result) => {
                res.status(200).json(result);

            })
            .catch((err) => {
                throw err;
            })
        }

        if(req.type === "limited") { limited() }
    }
}

module.exports = new User;