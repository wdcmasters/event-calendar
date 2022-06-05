
/*SIGN UP*/
function signup()
{
    //Store values in variables
    let firstName = document.getElementsByName("firstName")[0].value;
    let lastName = document.getElementsByName("lastName")[0].value;
    let password = document.getElementsByName("password")[0].value;
    let email = document.getElementsByName("email")[0].value;

    //Make the sign up object
    let newUser =   { first_name: firstName, last_name: lastName, password: password, email: email };

    //AJAX
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        //Not necessary
        if (this.readyState == 4 && this.responseStatus == 200)
        {
            alert("worked");
        }

        if (this.readyState == 4 && this.responseStatus == 500)
        {
            alert("Could not make account");
        }
    };

    //Open the request
    xhttp.open("POST", "/signup");
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(newUser));
}