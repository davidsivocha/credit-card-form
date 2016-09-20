/*
 * ----------------------------------
 * Validate the Card Number
 * ----------------------------------
 */
function validate_credit_card(value) {
    //accept only digits dashes or spaces
    if(/[^0-9-\s]+/.test(value)) return false;

    var nCheck = 0, nDigit = 0, bEven = false;
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

/*
 * ----------------------------------
 * Validate the Expiry Date
 * ----------------------------------
 */
function validExpirationDate(date) {
    var currentDate = new Date(),
        currentMonth = currentDate.getMonth() + 1,
        currentYear = currentDate.getFullYear(),
        expMonth = Number(date.substr(0,2)),
        expYear = Number(date.substr(3, date.length));

    if ( (expYear < currentYear) || (expYear == currentYear && expMonth <= currentMonth) ) {
        return false;
    }

    return true;
}

/*
 * ----------------------------------
 * Validate the CVV
 * ----------------------------------
 */
function validCVV(cvv) {
    //CVV must be at least 3 digits
    return cvv.length > 2;
}

/*
 * ----------------------------------
 * Get the Card Issuer
 * ----------------------------------
 */
function getCardType(ccNumber) {
    var cardPatterns = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/
    };

    for (var cardPattern in cardPatterns) {
        if(cardPatterns[cardPattern].test(ccNumber)) {
            return cardPattern;
        }
    }

    return false;
}

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
    number.inputmask("9999 9999 9999 9[999] [999]", {"placeholder": ""});
    expDate.inputmask("mm/yyyy", {"placeholder" : ""});
    cvv.inputmask("999[9]", {"placeholder" : ""});

    //focus the first field on page load
    number.focus();

    //on keyup set a time after which we trigger the finishTyping() function
    ccInputs.keyup(function(event) {
        if(event.keyCode != '9' && event.keyCode != '16') {
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
            if(validateForm()) {
                $(this).removeClass('disabled');
            } else {
                event.preventDefault();
                return false;
            }
        }

        $("#card-form").submit();
    });

    paymentForm.submit(function(event) {
        if(!validateForm()) {
            event.preventDefault();
            return false;
        }
    });

    //Run when finish typing
    function finishTyping(id, value) {
        var validationValue = value.replace(/ /g, ''),
            cardType = getCardType(validationValue),
            cardClass = (cardType != false) ? "cc-" + cardType : "cc-generic";

        switch(id) {
            case 'cc-number':
                if(validationValue.length > 0) {
                    numberOk = validate_credit_card(validationValue) && getCardType(validationValue);
                }

                if(numberOk) {
                    number.removeClass("error");
                    expDate.focus();
                } else {
                    number.addClass('error');
                }

                number.parent().attr('class', cardClass);
                break;
            case 'cc-expiration-date':
                if(validationValue.indexOf("m") == -1 && validationValue.indexOf("y") == -1) {
                    expDateOk = validExpirationDate(validationValue);

                    if(expDateOk) {
                        expDate.removeClass("error");
                        cvv.focus();
                    } else {
                        expDate.addClass('error');
                    }
                }
                break;
            case 'cc-cvv':
                cvvOk = validCVV(validationValue);

                if(cvvOk) {
                    cvv.removeClass("error");
                    paymentButton.focus();
                } else {
                    cvv.addClass('error');
                }
                break;
        }

        if (validateForm()) {
            paymentButton.removeClass('disabled');
        } else {
            paymentButton.addClass('disabled');
        }
    }

    function validateForm() {
        return (numberOk && expDateOk && cvvOk);
    }
});
