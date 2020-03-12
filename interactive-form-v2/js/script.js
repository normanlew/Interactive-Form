// Norman Lew

// Script for the online form to register for technology events in index.html


const form = document.querySelector('form');
const name = document.getElementById('name');
const email = document.getElementById('mail');
const activities = document.querySelector('.activities');
const activitiesList = document.querySelectorAll('.activities input');
const activitiesLegend = activities.firstElementChild;
const registrationError = createNewElement('p', 'textContent', 'You must register for at least one activity');
registrationError.style.color = 'red';
activitiesLegend.appendChild(registrationError);
registrationError.hidden = 'true'

// Make credit card payment the default payment method
const payment = document.getElementById('payment');
const paymentOptions = document.querySelectorAll('#payment option');
paymentOptions[0].disabled = true;
paymentOptions[1].selected = true;

// Focus on the name text field when the page loads
name.focus();

// Add additional default option to the color selection that
// prompts user to select a theme
const color = document.getElementById('color');
const selectThemeFirst = createNewElement('option', 'value', 'selectThemeFirst');
selectThemeFirst.textContent = 'Please select a T-shirt theme';
color.insertBefore(selectThemeFirst, color.firstElementChild);
const colorOptions = document.querySelectorAll('#color option');
colorOptions[0].selected = true;
colorOptions[0].disabled = true;

// function that hides all color options in color selection
// drop down menu
function hideAllColors() {
for (let i = 1; i < colorOptions.length; i++) {
        colorOptions[i].hidden = true;
    }
}

hideAllColors();

// This function creates a new element of 'type' 
// and sets the 'attribute' of that element to 'text'
function createNewElement(type, attribute, text) {
    const element = document.createElement(type);
    element[attribute] = text;
    return element;
 }

 // This function compares an element's value to a regex
 // expression
 const regexValidator = (regex, element) => {
    if (!regex.test(parseInt(element.value))) {
        element.style.borderColor = 'red';
        return false;
    } else {
        element.style.borderColor = 'white';
        return true;
    }
 }

// Helper function to validate name input.  The name field cannot be blank
const nameValidator = () => {
    if (name.value === '') {
        name.style.borderColor = 'red';
        return false;
    }
    else {
        name.style.borderColor = 'white';
        return true;
    }
}

// Helper function to validate email input
const emailValidator = () => {
    let regex = /[A-Za-z0-9]+@[a-zA-Z]+\.[a-z/A-Z]+/;
    if (!regex.test(email.value)) {
        email.style.borderColor = 'red';
        return false;
    }
    else {
        email.style.borderColor = 'white';
        return true;
    }
}

// Helper function to validate activity registration.
// User must register for at least one activity
const registrationValidator = ()  => {
    for (let i = 0; i < activitiesList.length; i++) {
        if (activitiesList[i].checked === true) {
            registrationError.hidden = true;
            return true;
        }
    }
    registrationError.hidden = false;
    return false;
}

// Helper function to validate whether credit information
// is entered correctly
const creditCardValidator = () => {
    const creditCardNumber = document.getElementById('cc-num');
    const zip = document.getElementById('zip');
    const cvv = document.getElementById('cvv');
    let regex = /^\d{13,16}$/;
    let regex2 = /^\d{5}$/;
    let regex3 = /^\d{3}$/;

    let creditCardNumberIsValid = regexValidator(regex, creditCardNumber);
    let zipIsValid = regexValidator(regex2, zip);
    let cvvIsValid = regexValidator(regex3, cvv);

    return (creditCardNumberIsValid || zipIsValid || cvvIsValid);
}



// Create an event listener for the job role drop-down menu
// Only display the text field for 'other' job role if none of the available job roles
// in the drop-down menu match the user's job role
const chosenJob = document.getElementById('title');
const otherJob = document.getElementById('other-title');
otherJob.style.display='none';
chosenJob.addEventListener('change', (e) => {
    if (e.target.value === 'other') {
        if (otherJob.style.display === 'none') {
            otherJob.style.display = 'block';
        }
    }
    else {
        if (otherJob.style.display !== 'none') {
            otherJob.style.display = 'none';
        }
    }
});

// Display the color options available for the selected theme
const design = document.getElementById('design');
const themeSelection = document.querySelectorAll('#design option');
design.addEventListener('change', (e) => {
    hideAllColors();
    const theTheme = e.target.value;
    if(theTheme === 'js puns') {
        for (let i = 1; i <= 3; i++) {
            colorOptions[i].hidden = false;
            colorOptions[0].hidden = true;
            colorOptions[0].selected = false;
        }
        for (let i = 4; i <= 6; i++) {
            colorOptions[i].hidden = true;
            colorOptions[i].selected = false;
        }
    }
    else if(theTheme === 'heart js') {
        for (let i = 1; i <= 3; i++) {
            colorOptions[i].hidden = true;
            colorOptions[i].selected = false;
        }
        colorOptions[4].selected = true;
        for (let i = 4; i <= 6; i++) {
            colorOptions[i].hidden = false;
            colorOptions[0].hidden = true;
            colorOptions[0].selected = false;
        }
    }
    else {
        selectThemeFirst.hidden = false;
        colorOptions[0].selected = true;
    }
});

// Only allow the user to register for activities that do not overlap during the day.  
// As the user selects activities, keep and display a running total of the cost.
let totalCost = 0;
const costBox = createNewElement('output', 'id', 'cost');
costBox.name = 'cost'
costBox.type = 'text';
const labelForCostBox = createNewElement('label', 'for', 'cost');
labelForCostBox.textContent = 'Total Cost: ' ;
activities.appendChild(labelForCostBox);
activities.appendChild(costBox);
costBox.hidden = false;
costBox.textContent = "$" + totalCost;

activities.addEventListener('change', (e) => {
    const activitySelected = e.target;
    if (activitySelected.name !== 'all') {
        const dayAndTime = activitySelected.getAttribute('data-day-and-time');
        if (activitySelected.checked === false) {
            for (let i = 0; i < activitiesList.length; i++) {
                if (activitiesList[i].getAttribute('data-day-and-time') === dayAndTime) {
                    activitiesList[i].disabled = false;
                }
            }
            totalCost -= parseInt(activitySelected.getAttribute('data-cost'));
        }
        else {
            for (let i = 0; i < activitiesList.length; i++) {
                if (activitiesList[i].getAttribute('data-day-and-time') === dayAndTime && activitySelected !== activitiesList[i]) {
                    activitiesList[i].disabled = true;
                }
            }
            totalCost += parseInt(activitySelected.getAttribute('data-cost'));
        }
    }
    else {
        if (activitySelected.checked) {
            totalCost += parseInt(activitySelected.getAttribute('data-cost'));
        }
        else {
            totalCost -= parseInt(activitySelected.getAttribute('data-cost'));
        }
    }
    costBox.textContent = "$" + totalCost;
});

// In the payment info section, payment sections are displayed depending on which
// payment method is selected.
const creditCardDiv = document.getElementById('credit-card');
const paypalDiv = document.getElementById('paypal');
const bitcoinDiv = document.getElementById('bitcoin');
paypalDiv.hidden = true;
bitcoinDiv.hidden = true;
payment.addEventListener('change', (e) => {
    paypalDiv.hidden = true;
    bitcoinDiv.hidden = true;
    creditCardDiv.hidden = true;
    const method = e.target.value;
    if (method === paymentOptions[1].value) {
        creditCardDiv.hidden = false;
    }
    else if (method === paymentOptions[2].value) {
        paypalDiv.hidden = false;
    }
    else if (method === paymentOptions[3].value) {
        bitcoinDiv.hidden = false;
    }
});

// When registration form is submitted, make sure all information is filled
// in correctly
form.addEventListener('submit', (e) =>{
    if (!nameValidator()) { 
        e.preventDefault();
    }

    if (!emailValidator()) { 
        e.preventDefault();
    }

    if (!registrationValidator()) { 
        e.preventDefault();
    }

    if (payment.options[payment.selectedIndex].value === 'credit card') {
        if (!creditCardValidator()) {
            e.preventDefault();
        }
    }
});


