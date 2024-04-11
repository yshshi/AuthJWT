
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../Models/User.js'

class UserController{
    static UserRegistration = async (req, res) => {
        const {name, email, password , password_confirm, tc} = req.body
        const user =  await UserModel.findOne({email:email})
        if (user) {
            res.send({"status":"failed", "message":"User already exists"})
        }
        else{
            if(name && email && password && password_confirm && tc){
                if (password === password_confirm) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name:name,
                            email:email,
                            password:hashPassword,
                            tc:tc
                        })
                        await doc.save()
                        const saved_user = await UserModel.findOne({email:email})
                        //Generate JWT
                        const token = jwt.sign({userId:saved_user._id}, process.env.JWT_Secret_Key, { expiresIn: '2d'})
                        res.send({"status":"success", "message":"Successfully registered!", "token":token})
                    } catch (error) {
                        console.log(error)
                        res.send({"status":"failed", "message":"Unable to register"})
                    }
                } else {
                    res.send({"status":"failed", "message":"Password and Confirm Password does not match"})
                }

            }
            else {
                res.send({"status":"failed", "message":"All fields are required"})
            }
        }
    }

    static userLogin = async (req, res) => {
        try {
            const {email, password} =  req.body
            if (email && password) {
                const user = UserModel.findOne({email:email})
                if(user != null){
                    const isMatch =  await bcrypt.compare(password, user.password)
                    if((user.email === email) && isMatch){
                        //Generate JWT Token
                        const token = jwt.sign({userId:user._id}, process.env.JWT_Secret_Key, { expiresIn: '2d'})
                        res.send({"status":"success", "message":"Login Success", "token": token})
                    }
                    else{
                        res.send({"status":"failed", "message":"Email or Password is not matching"})  
                    }
                }
                else{
                    res.send({"status":"failed", "message":"you are not resigtered user "})
                }
            } else {
                res.send({"status":"failed", "message":"Email and Password is  required"})
            }
            
        } catch (error) {
            res.send({"status":"failed", "message":"Unable to Login"})
        }
    }

    static logOut = async (req, res) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(401).json({ status: 'failed', message: 'No token provided' });
            }
        
    
            res.status(200).json({ status: 'success', message: 'Logged out successfully' });
        } catch (error) {
            // Handle any errors
            console.error('Unable to LogOut:', error);
            res.status(500).json({ status: 'failed', message: 'Internal server error' });
        }
    };

    static editUser = async (req, res) => {
        const { name, email, password, password_confirm, tc } = req.body;
        const userId = req.params.id;
    
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ status: "failed", message: "User not found" });
            }
            if (name) user.name = name;
            if (email) user.email = email;
            if (password) {
                if (password === password_confirm) {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password, salt);
                    user.password = hashPassword;
                } else {
                    return res.status(400).json({ status: "failed", message: "Password and Confirm Password does not match" });
                }
            }
            if (tc !== undefined) user.tc = tc;
    
            await user.save();
    
            // Generate JWT token
            const token = jwt.sign({ userId: user._id }, process.env.JWT_Secret_Key, { expiresIn: '2d' });
    
            res.json({ status: "success", message: "User updated successfully", token: token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: "failed", message: "Unable to update user" });
        }
    }
    
    
}

export default UserController;