var editIndex = -1;

function getAddedRecipes() {
    var savedRecipes = localStorage.getItem("addedRecipes");

    if (savedRecipes) {
        return JSON.parse(savedRecipes);
    } else {
        return [];
    }
}

function saveAddedRecipes(recipes) {
    localStorage.setItem("addedRecipes", JSON.stringify(recipes));
}

function showRecipeTable() {
    var tableBody = document.getElementById("recipeTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    fetch("data.json")
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonRecipes) {
            var addedRecipes = getAddedRecipes();
            var allRecipes = jsonRecipes.concat(addedRecipes);

            for (var i = 0; i < allRecipes.length; i++) {
                tableBody.innerHTML +=
                    "<tr>" +
                    "<td>" + (i + 1) + "</td>" +
                    "<td>" + allRecipes[i].name + "</td>" +
                    "<td>" + allRecipes[i].category + "</td>" +
                    "<td>" + allRecipes[i].time + "</td>" +
                    "<td>" + allRecipes[i].difficulty + "</td>" +
                    "<td>" + allRecipes[i].cost + "</td>" +
                    "<td>" + allRecipes[i].spice + "</td>" +
                    "</tr>";
            }
        })
        .catch(function() {
            tableBody.innerHTML =
                "<tr><td colspan='7'>Error loading data</td></tr>";
        });
}

function makeThreeDigitCode() {
    return Math.floor(100 + Math.random() * 900).toString();
}

function loadRecipe() {
    var nameBox = document.getElementById("editName");
    var codeBox = document.getElementById("editCode");
    var editMessage = document.getElementById("editMessage");
    var form = document.getElementById("recipeForm");
    var showFormButton = document.getElementById("showFormButton");

    if (!nameBox || !codeBox || !editMessage || !form) {
        return;
    }

    var name = nameBox.value.trim().toLowerCase();
    var code = codeBox.value.trim();
    var recipes = getAddedRecipes();
    var found = false;

    for (var i = 0; i < recipes.length; i++) {
        if (recipes[i].name.toLowerCase() === name && recipes[i].code === code) {
            document.getElementById("name").value = recipes[i].name;
            document.getElementById("category").value = recipes[i].category;
            document.getElementById("time").value = recipes[i].time;
            document.getElementById("difficulty").value = recipes[i].difficulty;
            document.getElementById("cost").value = recipes[i].cost;
            document.getElementById("spice").value = recipes[i].spice;
            document.getElementById("ingredients").value = recipes[i].ingredients || "";
            document.getElementById("steps").value = recipes[i].steps || "";
            document.getElementById("comments").value = recipes[i].comments || "";

            editIndex = i;
            form.style.display = "block";

            if (showFormButton) {
                showFormButton.style.display = "none";
            }

            editMessage.innerHTML = "Recipe loaded. Now edit and submit.";
            document.getElementById("message").innerHTML = "";
            found = true;
            break;
        }
    }

    if (!found) {
        editMessage.innerHTML = "Wrong recipe name or 3-digit code.";
    }
}

function setupForm() {
    var form = document.getElementById("recipeForm");
    var message = document.getElementById("message");
    var showFormButton = document.getElementById("showFormButton");

    if (!form) {
        return;
    }

    form.onsubmit = function(event) {
        event.preventDefault();

        var name = document.getElementById("name").value;
        var category = document.getElementById("category").value;
        var time = document.getElementById("time").value;
        var difficulty = document.getElementById("difficulty").value;
        var cost = document.getElementById("cost").value;
        var spice = document.getElementById("spice").value;
        var ingredients = document.getElementById("ingredients").value;
        var steps = document.getElementById("steps").value;
        var comments = document.getElementById("comments").value;

        var recipes = getAddedRecipes();
        var code = "";

        if (editIndex === -1) {
            code = makeThreeDigitCode();

            var newRecipe = {
                id: new Date().getTime(),
                name: name,
                category: category,
                time: time,
                difficulty: difficulty,
                cost: cost,
                spice: spice,
                ingredients: ingredients,
                steps: steps,
                comments: comments,
                code: code
            };

            recipes.push(newRecipe);

            alert("Recipe added! Your 3-digit code is: " + code);
            message.innerHTML = "Recipe added successfully! Your 3-digit code is: " + code;
        } else {
            code = recipes[editIndex].code;

            recipes[editIndex].name = name;
            recipes[editIndex].category = category;
            recipes[editIndex].time = time;
            recipes[editIndex].difficulty = difficulty;
            recipes[editIndex].cost = cost;
            recipes[editIndex].spice = spice;
            recipes[editIndex].ingredients = ingredients;
            recipes[editIndex].steps = steps;
            recipes[editIndex].comments = comments;

            alert("Recipe updated successfully! Your 3-digit code is: " + code);
            message.innerHTML = "Recipe updated successfully! Your 3-digit code is: " + code;

            editIndex = -1;
        }

        saveAddedRecipes(recipes);

        form.reset();
        form.style.display = "none";

        document.getElementById("editName").value = "";
        document.getElementById("editCode").value = "";
        document.getElementById("editMessage").innerHTML = "";

        if (showFormButton) {
            showFormButton.style.display = "inline-block";
        }
    };
}

function setupButtons() {
    var loadButton = document.getElementById("loadButton");
    var showFormButton = document.getElementById("showFormButton");
    var form = document.getElementById("recipeForm");
    var message = document.getElementById("message");

    if (loadButton) {
        loadButton.onclick = loadRecipe;
    }

    if (showFormButton) {
        showFormButton.onclick = function() {
            form.style.display = "block";
            showFormButton.style.display = "none";
            message.innerHTML = "";
            editIndex = -1;
        };
    }
}

window.onload = function() {
    showRecipeTable();
    setupForm();
    setupButtons();
};