import {collection, getDocs } from 'firebase/firestore';
import { orderBy } from "firebase/firestore";
import {db} from '../firebase';

export function getAllUsers(id){
    const userData = [
        {id: 1, username: "Somebody", fullname:"DESMOND DESMONDSON" },
        {id: 2, username: "AnotherGuy", fullname:"DEMARCUS COUSINS THE THIRD" }
    ]

    //we use this to return just one user
    if(id){
        return userData.filter(user => user.username == id);
    }
    
    return userData;
}

export async function getAllUsersFirebase(id){
    const querySnapshot = await getDocs(collection(db, "Users"));
    const docs = querySnapshot.docs.map(doc => doc.data());

    if(id){
        return docs.filter(user => user.username == id);
    }

    return docs;
    //this returns docs one by one
    // querySnapshot.forEach((doc) => {
    //     console.log(doc.id, " => ", doc.data());
    // });
}

export async function getAllPostsFirebase(id){
    const querySnapshot = await getDocs(collection(db, "Posts"), orderBy("timestamp", "desc"));
    const docs = querySnapshot.docs.map(doc => doc.data());

    const user = id.map(user => user.username)

    if(id){
        return docs.filter(post => post.username == user);
    }
    
    return docs;
}