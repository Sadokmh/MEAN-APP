const jwt = require('jsonwebtoken');




module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] // ba3ed Bearer yabda token ('Bearer token')
                                                            // just a convetion to send token in headers 
                                                            // you can edit it as you like
        const decodedToken = jwt.verify(token,'secret_key_should_be_longer_barsha');
        req.userData = {email: decodedToken.email , userId: decodedToken.id};
        next(); // when our middleware calls next, the request is going to move to the next middleware and               it's going to keep any fields we added to it  
    }
    catch(error) {
        res.status(401).json({
            message: 'Not authenticated!'
        });
    }
    
}