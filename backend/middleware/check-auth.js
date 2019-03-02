const jwt = require('jsonwebtoken');




module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1] // ba3ed Bearer yabda token ('Bearer token')
                                                            // just a convetion to send token in headers 
                                                            // you can edit it as you like
        jwt.verify(token,'secret_key_should_be_longer_barsha');
        next();
    }
    catch(error) {
        res.status(401).json({
            message: 'auth failed'
        });
    }
    
}