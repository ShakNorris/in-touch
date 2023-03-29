import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import { hash } from 'bcryptjs';

export default async function handleSignUp(req, res){
    connectMongo().catch(error => res.json({error: "Connection Failed"}))

    //post method is the only thing that is accepted

    if(req.method == 'POST'){
        if(!req.body) return res.status(404).json({error: "Don't have form data"})
        const {firstname, lastname, username, email, password} = req.body;

        //check if user is a dupe
        const checkexisting = await Users.findOne({email});
        if(checkexisting) return res.status(422).json({message: "This user already exists"});

        //TODO: Hash the password
        // CreateUser({firstname, lastname, username, email, password});
        Users.create({firstname, lastname, username, email, password : await hash(password, 12)}, function(err, data){
            if(err) return res.status(404).json({ err });
            res.status(201).json({ status : true, user: data})
        })
    }
    else{
        res.status(500).json({message: "Something's not right here"})
    }
}