var budgetController = (() => {

    // function constructor
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.expensePercent = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.expensePercent = Math.round(((this.value / totalIncome) * 100));
        }
        return this.expensePercent;
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

        deleteItem: (type, id) => {
            var ids, index;
            ids = data.allItems[type].map( (current) => {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },

        calculateBudget: () => {
            calculateTotal('exp');
            calculateTotal('inc');
        },

        calcParcentage: function() {
            var prcnteges = data.allItems.exp.map((curr) => {
                return curr.calculatePercentage(data.total.inc);
            });
            return prcnteges;
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
        budgetExpensePercentage: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage'
    };

    var formatNumber = (num, type) => {
        var numSplit, sign;

        num = Math.abs(num);
        num = num.toFixed(2);
        
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0 , (int.length -3)) + ',' + int.substr((int.length -3), int.length);
        }
        type === 'exp' ? sign = '-' : sign = '+';
        return sign + ' ' + int + '.' + numSplit[1];
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

                htmlChunk = '<div class="item clearfix" id="inc-----%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else {
                element = DOMStrings.expenseList;
                htmlChunk = '<div class="item clearfix" id="exp-----%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace placeholders with with value from obj
            htmlChunk = htmlChunk.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', formatNumber(obj.value, type));

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
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetValue).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.budgetIncome).textContent = formatNumber(obj.income, 'inc');
            document.querySelector(DOMStrings.budgetExpene).textContent = formatNumber(obj.expense, 'exp');
            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.budgetExpensePercentage).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.budgetExpensePercentage).textContent = '---';
            }

        },

        displayPercentages: function(percentages) {
            var fieldsList = document.querySelectorAll(DOMStrings.expensePercentageLabel);

            console.log(fieldsList);

            var nodeListForEach = function(list, callback) {
                console.log('inside node 1');
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodeListForEach(fieldsList, function(current, index) {
                console.log('inline', percentages, current);
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                }
            });
        },

        getDOMStrings: () => {
            return DOMStrings;
        },

        delteListItem: (id) => {
            // to delete from dom, move to parent, and then delete the child
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
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

        document.querySelector(domStrings.container).addEventListener('click', deleteItem);
    };

    var updateBudget = () => {
        var summary;
        budgetCtrl.calculateBudget();

        summary = budgetCtrl.getBudget();
        uiCtrl.displayBudget(summary);
    };

    var updatePercentage =  () => {
        var percentage = budgetCtrl.calcParcentage();
        uiCtrl.displayPercentages(percentage);
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
            updatePercentage();
        }
    };

    var deleteItem = (event) => {
        var itemId, type, id;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemId) {
            type = itemId.split('-----')[0];
            id = itemId.split('-----')[1];
            budgetCtrl.deleteItem(type, id);
            uiCtrl.delteListItem(itemId);
            updateBudget();
            updatePercentage();
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