const jwt =require('jsonwebtoken')

const generateToken =async(user)=>{
    return await jwt.sign({
        id:user._id,
        name:user.name 
    },process.env.JWT_SECRET,{expiresIn:'1d'})
}

module.exports={generateToken}