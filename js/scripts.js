$(function() {
    var number        = $('#cc-number'),
        expDate       = $('#cc-expiration-date'),
        cvv           = $('#cc-cvv'),
        paymentButton = $('#submit-payment'),
        paymentForm   = $('#card-form'),
        ccInputs      = $(".cc-input"),
        timerInterval = 1000,
        timer;

    //set the masks
    number.inputmask("9999 9999 9999 9[999] [999]", {"placeholder": "4242 4242 4242 4242"});
    expDate.inputmask("mm/yyyy", {"placeholder" : "01/2016"});
    cvv.inputmask("999[9]", {"placeholder" : "123"});

    //focus the first field on page load
    number.focus();

    //on keyup set a time after which we trigger the finishTyping() function
    ccInputs.keyup(function(event) {
        if(e.keyCode != '9' && e.keyCode != '16') {
            clearTimeout(timer);
            timer = setTimeout( finishTyping, timerInterval, $(this).attr('id'), $(this).val());
        }
    });

    //on keydown stop the current timer
    ccInputs.keydown(function(event) {
        clearTimeout(timer);
    });

    //Add active class to spans on field focus
    ccInputs.focus(function() {
        $("#title-" + $(this).attr('id')).addClass("active");
    });

    //Remove active class from spans on blur
    ccInputs.blur(function() {
        $("h2 span").removeClass("active");
    });

    paymentButton.click(function(event){
        if($(this).hasClass('disabled')) {
            event.preventDefault();
            return false;
        }

        $("#card-form").submit();
    });

    paymentForm.submit(function(event) {
        event.preventDefault();

        if(!validateForm()) {
            return false;
        }
    });

    //Run when finish typing
    function finishTyping(id, value) {
        switch(id) {
            case 'cc-number':
                break;
            case 'cc-expiration-date':
                break;
            case 'cc-cvv':
                break;
        }
    }

    function validateForm() {
        return false;
    }
});
