// Norman Lew


const form = document.querySelector('form');
const name = document.getElementById('name');
const email = document.getElementById('mail');
const activities = document.querySelector('.activities');
const activitiesList = document.querySelectorAll('.activities input');
const activitiesLegend = activities.firstElementChild;
const registrationError = document.createElement('p');
registrationError.textContent = 'You must register for at least one activity';
registrationError.style.color = 'red';
activitiesLegend.appendChild(registrationError);
registrationError.hidden = 'true'

const payment = document.getElementById('payment');
const paymentOptions = document.querySelectorAll('#payment option');
paymentOptions[0].disabled = true;
paymentOptions[1].selected = true;

// Focus on the name text field when the page loads
name.focus();

// Add additional default option to the color selection that
// prompts user to select a theme
const color = document.getElementById('color');
const selectThemeFirst = document.createElement('option');
selectThemeFirst.value = 'selectThemeFirst';
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
    let regex = /^\d{13,16}$/;
    let creditInfoIsCorrect = true;

    if (!regex.test(parseInt(creditCardNumber.value))) {
        creditCardNumber.style.borderColor = 'red';
        creditInfoIsCorrect = false;
    } else {
        creditCardNumber.style.borderColor = 'white';
    }

    const zip = document.getElementById('zip');
    regex = /^\d{5}$/;
    if (!regex.test(parseInt(zip.value))) {
        zip.style.borderColor = 'red';
        creditInfoIsCorrect = false;
    }
    else {
        zip.style.borderColor = 'white';
    }

    const cvv = document.getElementById('cvv');
    regex = /^\d{3}$/;
    if (!regex.test(parseInt(cvv.value))) {
        cvv.style.borderColor = 'red';
        creditInfoIsCorrect = false;
    }
    else {
        cvv.style.borderColor = 'white';
    }

    return creditInfoIsCorrect;
}


const chosenJob = document.getElementById('title');
const otherJob = document.getElementById('other-title');
otherJob.style.display='none';
// Create an event listener for the job role drop-down menu
// Only display the text field for 'other' job role if none of the available job roles
// in the drop-down menu match the user's job role
chosenJob.addEventListener('change', (e) => {
    console.log(e.target);
    console.log(e.target.value);
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
const costBox = document.createElement('output');
costBox.id = 'cost';
costBox.name = 'cost'
costBox.type = 'text';
const labelForCostBox = document.createElement('label');
labelForCostBox.for = 'cost';
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
    if (method === paymentOptions[2].value) {
        console.log(paypalDiv);
        paypalDiv.hidden = false;
        console.log(paypalDiv.firstElementChild);
    }
    if (method === paymentOptions[3].value) {
        console.log(bitcoinDiv);
        bitcoinDiv.hidden = false;
        console.log(bitcoinDiv.firstElementChild);
    }
});

form.addEventListener('submit', (e) =>{
    nameValidator();
    emailValidator();
    registrationValidator();

    if (payment.options[payment.selectedIndex].value === 'credit card') {
        creditCardValidator();
    }
    
    e.preventDefault();
});


