// Login Message

function loginMessage()
{
    alert("Login Successful!");
}



// Register Validation

function validateRegister()
{
    let name =
    document.getElementById("name").value;


    if(name == "")
    {
        alert("Please enter your name");
        return false;
    }


    alert("Registration Successful!");

    return true;
}



// FAQ Answer Display

function showAnswer()
{
    document.getElementById("answer").innerHTML =
    "StudentHub is a platform that helps students manage courses, assignments, events and study materials.";
}



// Dark Mode

function darkMode()
{
    document.body.style.backgroundColor="black";
    document.body.style.color="white";
}



// Show Current Year in Footer

function year()
{
    document.getElementById("year").innerHTML =
    new Date().getFullYear();
}