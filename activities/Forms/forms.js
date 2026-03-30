document.getElementById('myForm').addEventListener('submit',function(event) {
event.preventDefault();
        //alert("Form Submitted");

        const Name = document.getElementById('name').value;
        const Email = document.getElementById('email').value; 
        const Password = document.getElementById('password').value;
        const DateofBirth = document.getElementById('birthdate').value;
        const State = document.getElementById('state').value;
        
        


        if (!Name || !Email) {
            alert("You need a name and email.");
            return;;
    }
    
        if (!age || !age < 18) {
            alert("You must be at least 18 years old or more.");
            return;
    }   

    const formData = {
        Name: Name,
        Email: Email,
        Password: Password,
        DateofBirth: DateofBirth,


    };

    console.log(formData);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "submit.json", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UFT-8");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200){
            alert("Form submitted successfully!");
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            //document.getElementById('myForm').reset();
            document.getElementById('myForm').innerHTML = '';
            document.getElementById('message').innerText = response.message;
        } else if (xhr.readyState === 4){
            alert('Error submitting form.')
        }
    };
    xhr.send(JSON.stringify(formData));

});


