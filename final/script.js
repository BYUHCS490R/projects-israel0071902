let allRecipes = [];
let currentEditIndex = -1;

function loadRecipes() {
    let savedRecipes = localStorage.getItem("recipes");

    if (savedRecipes) {
        allRecipes = JSON.parse(savedRecipes);
        showPageData();
    } else {
        fetch("data.json")
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                allRecipes = data;
                localStorage.setItem("recipes", JSON.stringify(allRecipes));
                showPageData();
            });
    }
}

function makeThreeDigitCode() {
    return Math.floor(100 + Math.random() * 900).toString();
}

function showPageData() {
    showRecipesByCategory("Meal", "mealList");
    showRecipesByCategory("Sweet", "sweetList");
    showRecipesByCategory("Drink", "drinkList");
    showRecipeTable();
}

function makeList(items) {
    let text = "<ul>";

    for (let i = 0; i < items.length; i++) {
        text += "<li>" + items[i] + "</li>";
    }

    text += "</ul>";
    return text;
}

function showRecipesByCategory(category, elementId) {
    let box = document.getElementById(elementId);

    if (!box) {
        return;
    }

    box.innerHTML = "";

    for (let i = 0; i < allRecipes.length; i++) {
        if (allRecipes[i].category === category) {
            let imagePart = "";

            if (allRecipes[i].image !== "") {
                imagePart = "<img src='" + allRecipes[i].image + "' alt='" + allRecipes[i].name + "'>";
            }

            box.innerHTML +=
                "<div class='recipe-box'>" +
                "<h3>" + allRecipes[i].name + "</h3>" +
                imagePart +
                "<p>" + allRecipes[i].description + "</p>" +
                "<p><strong>Time:</strong> " + allRecipes[i].time + "</p>" +
                "<p><strong>Difficulty:</strong> " + allRecipes[i].difficulty + "</p>" +
                "<p><strong>Cost:</strong> " + allRecipes[i].cost + "</p>" +
                "<p><strong>Spice:</strong> " + allRecipes[i].spice + "</p>" +
                "<p><strong>Ingredients:</strong></p>" +
                makeList(allRecipes[i].ingredients) +
                "<p><strong>Steps:</strong></p>" +
                makeList(allRecipes[i].steps) +
                "</div>";
        }
    }
}

function showRecipeTable() {
    let tableBody = document.getElementById("recipeTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    for (let i = 0; i < allRecipes.length; i++) {
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
}

function setupForm() {
    let form = document.getElementById("recipeForm");

    if (!form) {
        return;
    }

    form.onsubmit = function(event) {
        event.preventDefault();

        let recipeName = document.getElementById("recipeName").value;
        let category = document.getElementById("category").value;
        let image = document.getElementById("image").value;
        let description = document.getElementById("description").value;
        let time = document.getElementById("time").value;
        let difficulty = document.getElementById("difficulty").value;
        let cost = document.getElementById("cost").value;
        let spice = document.getElementById("spice").value;
        let ingredients = document.getElementById("ingredients").value;
        let steps = document.getElementById("steps").value;

        let code = "";

        if (currentEditIndex === -1) {
            code = makeThreeDigitCode();
        } else {
            code = allRecipes[currentEditIndex].editCode;
        }

        let newRecipe = {
            id: Date.now(),
            name: recipeName,
            category: category,
            image: image,
            description: description,
            time: time,
            difficulty: difficulty,
            cost: cost,
            spice: spice,
            ingredients: ingredients.split(",").map(function(item) {
                return item.trim();
            }),
            steps: steps.split(",").map(function(item) {
                return item.trim();
            }),
            editCode: code
        };

        let messageText = "";

        if (currentEditIndex === -1) {
            allRecipes.push(newRecipe);
            messageText = "Form submitted successfully! If you want to edit your recipe later, use this 3-digit code: " + code;
        } else {
            allRecipes[currentEditIndex] = newRecipe;
            messageText = "Recipe updated successfully! If you want to edit it again later, use this 3-digit code: " + code;
            currentEditIndex = -1;
            document.getElementById("formTitle").innerHTML = "Add a Recipe";
            document.getElementById("submitButton").innerHTML = "Add Recipe";
        }

        localStorage.setItem("recipes", JSON.stringify(allRecipes));
        document.getElementById("message").innerHTML = messageText;
        alert(messageText);

        form.reset();
        document.getElementById("editRecipeName").value = "";
        document.getElementById("editCode").value = "";
        document.getElementById("editMessage").innerHTML = "";
        document.getElementById("recipeForm").style.display = "none";

        let showFormButton = document.getElementById("showFormButton");
        if (showFormButton) {
            showFormButton.style.display = "inline-block";
        }
    };
}

function setupEditSearch() {
    let editButton = document.getElementById("loadEditButton");

    if (!editButton) {
        return;
    }

    editButton.onclick = function() {
        let searchName = document.getElementById("editRecipeName").value.trim().toLowerCase();
        let searchCode = document.getElementById("editCode").value.trim();
        let found = false;

        for (let i = 0; i < allRecipes.length; i++) {
            if (allRecipes[i].name.toLowerCase() === searchName && allRecipes[i].editCode === searchCode) {
                document.getElementById("recipeName").value = allRecipes[i].name;
                document.getElementById("category").value = allRecipes[i].category;
                document.getElementById("image").value = allRecipes[i].image;
                document.getElementById("description").value = allRecipes[i].description;
                document.getElementById("time").value = allRecipes[i].time;
                document.getElementById("difficulty").value = allRecipes[i].difficulty;
                document.getElementById("cost").value = allRecipes[i].cost;
                document.getElementById("spice").value = allRecipes[i].spice;
                document.getElementById("ingredients").value = allRecipes[i].ingredients.join(", ");
                document.getElementById("steps").value = allRecipes[i].steps.join(", ");

                currentEditIndex = i;
                document.getElementById("formTitle").innerHTML = "Edit Recipe";
                document.getElementById("submitButton").innerHTML = "Update Recipe";
                document.getElementById("editMessage").innerHTML = "Recipe loaded. Now you can edit it.";
                document.getElementById("recipeForm").style.display = "block";

                let showFormButton = document.getElementById("showFormButton");
                if (showFormButton) {
                    showFormButton.style.display = "none";
                }

                found = true;
                break;
            }
        }

        if (!found) {
            document.getElementById("editMessage").innerHTML = "Wrong recipe name or 3-digit code.";
        }
    };
}

window.onload = function() {
    loadRecipes();
    setupForm();
    setupEditSearch();

    let showFormButton = document.getElementById("showFormButton");
    if (showFormButton) {
        showFormButton.onclick = function() {
            document.getElementById("recipeForm").style.display = "block";
            document.getElementById("showFormButton").style.display = "none";
            document.getElementById("message").innerHTML = "";
            document.getElementById("formTitle").innerHTML = "Add a Recipe";
            document.getElementById("submitButton").innerHTML = "Add Recipe";
            currentEditIndex = -1;
        };
    }
};