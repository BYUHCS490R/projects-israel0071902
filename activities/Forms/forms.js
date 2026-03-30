document.getElementById('myForm').addEventListener('submit',function(event) {
event.preventDefault();

const Name = document.getElementById('name').value;
    const Email = document.getElementById('email').value;
    const Password = document.getElementById('password').value;
    const DateofBirth = document.getElementById('birthdate').value;
    const age = document.getElementById('age').value;
    const State = document.getElementById('state').value;
    const Comments = document.getElementById('comments').value;
    const Proficiency = document.getElementById('skill').value;

    const GenderElement = document.querySelector('input[name="gender"]:checked');
    const Gender = GenderElement ? GenderElement.value : "";

    const LanguagesElement = document.querySelectorAll('input[name="language"]:checked');
    const LanguagesKnown = [];
    LanguagesElement.forEach(function(language) {
        LanguagesKnown.push(language.value);
    });


        if (!Name || !Email || !Password) {
            alert("You need a name, email, and password.");
            return;
    }


        if (!age || age < 18) {
             alert("You must be at least 18 years old or more.");
            return;
    }

        const formData = {
        Name: Name,
        Email: Email,
        Password: Password,
        DateofBirth: DateofBirth,
        State: State,
        age: age,   
        Comments: Comments,
        Gender: Gender,
        LanguagesKnown: LanguagesKnown,
        Proficiency: Proficiency
    };

    console.log(formData);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "submit.json", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
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


