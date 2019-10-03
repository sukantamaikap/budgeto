var budgetController = (() => {
    var x = 23;

    return {
        showX : () => {
            console.log(x)
        }
    }
})();

var uiController = (() => {

})();

var controller = ((budgetCtrl, uiCtrl) => {

})(budgetController, uiController);
