const Users = require("../models/user.model");
const bcrypt = require('bcrypt');
const { generateToken } = require("../services/jwtService");

// Users.findOne() // atrast vienu ierakstu
// Users.deleteOne({ username: "john_doe" }) // izdzēst vienu ierakstu
// Users.deleteMany({ role: "user" }) // izdzēst vairākus ierakstus
// Users.updateOne({ username: "john_doe" }, { password: "newpassword" }) // atjaunot vienu ierakstu
// Users.updateMany({ role: "user" }, { role: "member" }) // atjaunot vairākus ierakstus
// Users.find() // atrast visus ierakstus


// Create user in database if not exists
const createUserIfNotExists = async () => {
    try {
        //parbaudīt vai jau pastāv
        let user = await Users.findOne({
            username: "sabine",
        });

        if (user) {
            console.log("Admin user already exists");
            return;
        }
        
        const password = "password123";
        //ja neeksistē, izveido
        user = new Users({
           username: "sabine",
           password,
           role: "admin",
        });

        let hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        
        
        await user.save()
        console.log("Admin user created");
        return;

        
    } catch (ex) {
        console.log(ex);
    }

}


module.exports = createUserIfNotExists;