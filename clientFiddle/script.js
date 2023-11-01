var stripe = Stripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');
var elements = stripe.elements();

var card = elements.create('card', {
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: 'Helvetica Neue',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  }
});
card.mount('#card-element');

function setOutcome(result) {
  var successNewCardElement = document.querySelector('.success-new-card');
  var successSavedCardElement = document.querySelector('.success-saved-card');
  var errorElement = document.querySelector('.error');
  successNewCardElement.classList.remove('visible');
  successSavedCardElement.classList.remove('visible');
  errorElement.classList.remove('visible');
  
  if (result.token) {
    // Use the token to create a charge or a customer
    // https://stripe.com/docs/charges
    successNewCardElement.querySelector('.token').textContent = result.token.id;
    successNewCardElement.classList.add('visible');
  } else if (result.saved_card) {
    successSavedCardElement.querySelector('.saved-card').textContent = result.saved_card;
    successSavedCardElement.classList.add('visible');
  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');
  }
}

card.on('focus', function(event) {
  document.querySelector('#new-card-radio').checked = true;
});

card.on('change', function(event) {
  setOutcome(event);
});

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  var radioButton = document.querySelector('input[name="payment-source"]:checked');
  if (radioButton.value == 'new-card') {
    stripe.createToken(card).then(setOutcome);
  } else {
    setOutcome({saved_card: radioButton.value});
  }
});
