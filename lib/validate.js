export default function LoginValidation(values){
    const errors = {};

    if (!values.email) {
        errors.email = 'Email is Required!';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

    // validation for password
    if(!values.password){
        errors.password = "Password is Required!";
    } else if(values.password.length < 8 || values.password.length > 20){
        errors.password = "Must be greater then 8 and less then 20 characters long";
    } else if(values.password.includes(" ")){
        errors.password = "Invalid Password";
    }

    return errors;

}

export function RegisterValidation(values){
    const errors = {};

    if(!values.firstname){
        errors.firstname = "First Name is Required";
    }else if(values.firstname.includes(" ")){
        errors.firstname = "First Name is Invalid!"
    }
    if(!values.lastname){
        errors.lastname = "Last Name is Required";
    }else if(values.lastname.includes(" ")){
        errors.lastname = "Last Name is Invalid!"
    }

    if(!values.username){
        errors.username = "Username is Required";
    }else if(values.username.includes(" ")){
        errors.username = "Invalid Username...!"
    }

    if (!values.email) {
        errors.email = 'Email is Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
    }

       // validation for password
       if(!values.password){
        errors.password = "Password is Required";
    } else if(values.password.length < 8 || values.password.length > 20){
        errors.password = "Must be greater then 8 and less then 20 characters long";
    } else if(values.password.includes(" ")){
        errors.password = "Invalid Password";
    }

    // validate confirm password
    if(!values.cpassword){
        errors.cpassword = "Confirm Password is Required";
    } else if(values.password !== values.cpassword){
        errors.cpassword = "Password Not Match...!"
    } else if(values.cpassword.includes(" ")){
        errors.cpassword = "Invalid Confirm Password"
    }

    return errors;
}