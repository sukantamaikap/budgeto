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
        },
        budget: 0,
        percentage: -1
    };
    var calculateTotal = (type) => {
        var sum = 0;
        data.allItems[type].forEach((curr) => {
            sum += curr.value;
        });
        data.total[type] = sum;

        data.budget = data.total.inc - data.total.exp;

        if(data.total.exp > 0) {
            data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
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

            data.allItems[type].push(item);
            return item;
        },

        calculateBudget: () => {
            calculateTotal('exp');
            calculateTotal('inc');
        },

        getBudget: () => {
            return {
                budget: data.budget,
                income: data.total.inc,
                expense: data.total.exp,
                percentage: data.percentage
            }
        }
    };
})();

var uiController = (() => {
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        budgetValue: '.budget__value',
        budgetIncome: '.budget__income--value',
        budgetExpene: '.budget__expenses--value',
        budgetExpensePercentage: '.budget__expenses--percentage'
    };


    return {
        getInput: () => {
            return {
            type: document.querySelector(DOMStrings.inputType).value,
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addList: (type, obj) => {
            // create html string with placeholder
            var element, htmlChunk;
            if(type === 'inc') {
                element = DOMStrings.incomeList;

                htmlChunk = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else {
                element = DOMStrings.expenseList;
                htmlChunk = '<div class="item clearfix" id="%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace placeholders with with value from obj
            htmlChunk = htmlChunk.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', htmlChunk);

        },

        clearFields: () => {
            var fields, fieldsArr;
            // returns a coma separated elements matching the criterial
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            Array.prototype.slice.call(fields).forEach(function(element) {
                element.value = '';
            });
            fields[0].focus();
        },

        displayBudget: (obj) => {
            console.table(obj);
            document.querySelector(DOMStrings.budgetValue).textContent = obj.budget;
            document.querySelector(DOMStrings.budgetIncome).textContent = obj.income;
            document.querySelector(DOMStrings.budgetExpene).textContent = obj.expense;
            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.budgetExpensePercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.budgetExpensePercentage).textContent = '---';
            }

        },

        getDOMStrings: () => {
            return DOMStrings;
        }
    };

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
    };

    var updateBudget = () => {
        budgetCtrl.calculateBudget();
    };

    var addItem = () => {
        var inputs, newItem;

        inputs = uiCtrl.getInput();

        if(inputs.description != '' && !isNaN(inputs.value) && inputs.value > 0) {
            var summary;
            newItem = budgetController.addItem(inputs.type, inputs.description, inputs.value);
            uiCtrl.addList(inputs.type, newItem);
            uiCtrl.clearFields();
            updateBudget();
            summary = budgetCtrl.getBudget();
            uiCtrl.displayBudget(summary);
        }
    };

    return {
        init: () => {
            setupEventListeners();
            uiCtrl.displayBudget({
                budget: 0,
                income: 0,
                expense: 0,
                percentage: -1
            });
        }
    };
})(budgetController, uiController);

controller.init();