var budgetController = (() => {
})();

var uiController = (() => {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'

    }


    return {
        getInput: () => {
            return {
            type: document.querySelector(DOMStrings.inputType).value,
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: document.querySelector(DOMStrings.inputValue).value
            }
        },

        getDOMStrings: () => {
            return DOMStrings;
        }
    }

})();

var controller = ((budgetCtrl, uiCtrl) => {
    var domStrings = uiCtrl.getDOMStrings();

    var addItem = () => {
        var inputs = uiCtrl.getInput();
        console.log(inputs);
    }

    document.querySelector(domStrings.inputBtn).addEventListener('click', addItem);

    // action based on enter key press
    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            console.log("enter pressed!!")
            addItem();
        }
    });

})(budgetController, uiController);