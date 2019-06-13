$(document).ready(function() {


var hasWaiting = false;

    // if (hasWaiting === false) {
        $(".fighter").click(function() { 
            $("h1").text("Choose your opponent!")
            $("img").appendTo("#defenders");
            $(this).appendTo("#chosen-character");
            $("#chosen-character").css("display", "inherit");
            $("#defenders").css("display", "inherit");
            $("#defenders").children().addClass("waiting");
            hasWaiting = true;
            $("#defenders").children().removeClass("fighter");
            // $("img").prop("margin", "2%");
        });
    // } else {
    //     $(".waiting").click(function() {        
    //          $(this).appendTo("#battle");
    //          console.log(this);
    //      });

    // }

});