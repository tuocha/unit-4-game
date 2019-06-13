$(document).ready(function () {

    var characters = {
        "arya stark": {
            name: "arya stark",
            health: 90,
            attack: 18,
            image: "assets/images/arya.png",
            enemyAttackBack: 15
        },
        "jorah mormont": {
            name: "jorah mormont",
            health: 120,
            attack: 14,
            image: "assets/images/jorah.jpg",
            enemyAttackBack: 13
        },
        "brienne of tarth": {
            name: "brienne of tarth",
            health: 100,
            attack: 12,
            image: "assets/images/brienne.webp",
            enemyAttackBack: 18
        },
        "grey worm": {
            name: "grey worm",
            health: 115,
            attack: 10,
            image: "assets/images/grey worm.jpg",
            enemyAttackBack: 20
        }
    }

    // holds the chosen character
    var champion;
    // holds the remaining characters
    var defenders = [];
    // holds the chosen character to fight
    var opponent;
    // will keep track of turns during combat. used to calculated player damage
    var roundCounter = 1;
    // tracks opponents defeated
    var killCounter = 0;


    //functions

    // this function renders a character card to the page
    // determines the character rendered, the area rendered to, and the status
    var renderCard = function (character, renderArea) {
        //builds the character card by adding classes and attributes to render it on the page
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.image);
        var charHealth = $("<div class='character-health'>").text(character.health);
        //DOM manipulation
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);
    };

    // this function loads the selectable champions into the selection area
    var startGame = function () {
        //loop through the character object and call the renderCard function on each one
        for (var key in characters) {
            renderCard(characters[key], "#champions-div");
        }
    };

    // this function handles refreshing the character after an action
    var refreshCharacter = function (charObj, renderArea) {
        //first we empty the area so we can re-render the new object
        $(renderArea).empty();
        // then places the character based on the renderArea chosen
        renderCard(charObj, renderArea);
    };

    // this function will render the queued enemies. run only once.
    var renderEnemies = function (enemyArr) {
        for (var i = 0; i < enemyArr.length; i++) {
            renderCard(enemyArr[i], "#queue-section");
        }
    };

    // this function handles game messages
    var renderMessage = function (message) {
        //builds the message and appends it to the page
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);
    };

    // function that handles restarting the game after victory or defeat
    var restartGame = function (resultMessage) {
        //creates a restart button and that refreshes the page upon being clicked
        var restart = $("<button id='restart-button'>restart</button>").click(function () {
            location.reload();
        });
        //build a div that will display the victory/defeat message
        var gameState = $("<div id='result-message'>").text(resultMessage);

        //render the restart button and victory/defeat message to the page
        $("body").append(gameState);
        $("body").append(restart);
    };

    // function to clear the game message section
    var clearMessage = function () {
        var gameMessage = $("game-message");

        gameMessage.text("");
    }



    //event handlers

    //onclick for selecting your champion
    $("#champions-div").on("click", ".character", function () {
        //storing the champion's name
        var name = $(this).attr("data-name");

        //conditional statment signifying if a player character has not yet been chosen
        if (!champion) {
            //we populate champion with the selected character's information
            champion = characters[name];
            //we then loop through the remaining characters and push them to the defenders array
            for (var key in characters) {
                if (key !== name) {
                    defenders.push(characters[key]);
                }
            }

            //hide the character select div
            $("#champions-div").hide();

            //then render our selected character and our defenders
            refreshCharacter(champion, "#chosen-character");
            renderEnemies(defenders);
        }
    });

    //creates an onclick for opponent selection
    $("#queue-section").on("click", ".character", function () {
        //storing the opponent's name
        var name = $(this).attr('data-name');

        //conditonal statement denoting if there is no opponent, the clicked enemy will become it
        if ($("#opponent").children().length === 0) {
            opponent = characters[name];
            refreshCharacter(opponent, "#opponent");

            //remove element out of the queue section
            $(this).remove();
            clearMessage();
        }

    });

    //onclick for the attack button
    $("#attack-button").on("click", function () {
        //if there is an element in the opponent div, combat will occur
        if ($("#opponent").children().length !== 0) {
            //creates messages for battle logic (champion attack, opponent counter)
            var attackMessage = "You attacked " + opponent.name + " for " + (Math.floor(champion.attack * roundCounter) / 2);

            var counterAttackMessage = opponent.name + " attacked you back for " + opponent.attack;
            clearMessage();

            //reduce opponent's health by your attack value
            opponent.health -= (Math.floor(champion.attack * roundCounter) / 2);

            //if the enemy still has health
            if (opponent.health > 0) {
                // refresh the enemy's updated character card
                refreshCharacter(opponent, "#opponent");

                //display the combat messages
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                //reduce your health by the enemy's attack value
                champion.health -= opponent.enemyAttackBack;

                //render the player's updated character card
                refreshCharacter(champion, "#chosen-character");

                //if you lose all your health, the game ends and we call the restartGame function  
                if (champion.health <= 0) {
                    clearMessage();
                    restartGame("You lost. game over!");
                    //disable the attack button
                    $("#attack-button").off("click");
                }
            }
            else {
                //if the enemy has less than zero health they are defeated
                //remove your opponent's character card
                $("#opponent").empty();

                var gameStateMessage = "You have defeated " + opponent.name + ". Choose another opponent.";
                renderMessage(gameStateMessage);

                //increment killCounter
                killCounter++;

                //conditional statment for win condition
                //call the restart game function
                if (killCounter >= defenders.length) {
                    clearMessage();
                    $("attack-button").off("click");
                    restartGame("You won! congrats");
                }
            }
            //increment turn counter to increase damage of champion
            roundCounter++;
        } else {
            //if there is no defender, show error message
            clearMessage();
            renderMessage("choose an opponent")
        }
    });



    //have to call the startGame function 
    startGame();
});