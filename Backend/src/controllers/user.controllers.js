class UserController {

    async userRegister(req,res){
        const {username,email,password,phone_no,address,role}= req.body
        if(!username || !email || !password || !phone_no || !address || !role){
            
        }

    }
}

export default new UserController();
