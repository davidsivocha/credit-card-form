$(function() {
    var number        = $('#cc-number'),
        expDate       = $('#cc-expiration-date'),
        cvv           = $('#cc-cvv'),
        paymentButton = $('#submit-payment');

        //set the masks
        number.inputmask("9999 9999 9999 9[999] [999]", {"placeholder": "4242 4242 4242 4242"});
        expDate.inputmask("mm/yyyy", {"placeholder" : "01/2016"});
        cvv.inputmask("999[9]", {"placeholder" : "123"});

        number.focus();
});
