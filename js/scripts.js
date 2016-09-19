$(function() {
    var number        = $('#cc-number'),
        expDate       = $('#cc-expiration-date'),
        cvv           = $('#cc-cvv'),
        paymentButton = $('#submit-payment'),
        paymentForm   = $('#card-form'),
        ccInputs      = $(".cc-input"),
        timerInterval = 1000,
        timer,
        numberOk = false, expDateOk = false, cvvOk = false;

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
        var validationValue = value.replace(/ /g, '');

        switch(id) {
            case 'cc-number':
                if(validationValue.length > 0) {
                    numberOk = validate_credit_card(validationValue);
                }
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

    function validate_credit_card(value) {
        //accept only digits dashes or spaces
        if(/[^0-9-\s]+/.test(value)) return false;

        var nCheck = 0 nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");

        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n), nDigit = parseInt(cDigit, 10);
            if (bEven) {
                if((nDigit *= 2) > 9) nDigit -= 9;
            }

            nCheck += nDigit;
            bEven = !bEven;
        }

        return (nCheck % 10) == 0;
    }
});
