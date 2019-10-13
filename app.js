var budgetController = (() => {

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        total: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: (type, description, value) => {
            var item, id;

            id = Math.random().toString(36).slice(2);
            if( type === 'inc') {           
                item = new Income(id, description, value);
            } else {
                item = new Expense(id, description, value);
            }

            data.allItems[type].push(type);
            return item;
        },

        showRecord: () => {
            console.table(data);
        }
    };
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

    var setupEventListeners = () => {
        var domStrings = uiCtrl.getDOMStrings();

        document.querySelector(domStrings.inputBtn).addEventListener('click', addItem);

    // action based on enter key press
    document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
            addItem();
        }
    });
    }

    var addItem = () => {
        var inputs, newItem;

        inputs = uiCtrl.getInput();
        newItem = budgetController.addItem(inputs.type, inputs.description, inputs.value);

        console.table(newItem);
    }

    return {
        init: () => {
            setupEventListeners();
        }
    }

})(budgetController, uiController);

controller.init();