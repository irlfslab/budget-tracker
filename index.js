const form = document.querySelector(".add");
const incomeList = document.querySelector("ul.income-list");
const expenseList = document.querySelector("ul.expense-list");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const vmsg = document.getElementById("msg");

let trans = localStorage.getItem("trans") !== null ? JSON.parse(localStorage.getItem("trans")) : [];


function updTotals(){
    //const updIncome = trans.filter(tran => {
    //    return tran.amount > 0;
    // })
    //console.log(updIncome);
    
    //const updExpense = trans.filter(tran => {
    //    return tran.amount < 0;
    //})
    //console.log(updExpense);
    
    const updIncome = trans
                            .filter(tran => tran.amount > 0)
                            .reduce((total, tran) => total += tran.amount, 0);

    const updExpense = trans
                            .filter(tran => tran.amount < 0)
                            .reduce((total, tran) => total += Math.abs(tran.amount), 0);

    let updBalance = updIncome - updExpense;
    balance.textContent = updBalance;
    income.textContent = updIncome;
    expense.textContent = updExpense;
    
}

function genHist(id, source, amount, time){
    return `<li data-id="${id}">
                <p>
                    <span>${source}</span>
                    <span id="time">${time}</span>
                </p>
                $<span>${Math.abs(amount)}</span>
                <i class="bi bi-trash delete"></i>
            </li>`;
}

function addTranHist(id, source, amount, time){
    if(amount > 0){
        incomeList.innerHTML += genHist(id, source, amount, time);
    } else {
        expenseList.innerHTML += genHist(id, source, amount, time);
    }
}

function addTran(source, amount){
    const time = new Date();
    const tran = {
        id: Math.floor(Math.random()*100000),
        source: source,
        amount: amount,
        time: `${time.toLocaleTimeString()} ${time.toLocaleDateString()}`
    };
    trans.push(tran);
    localStorage.setItem("trans", JSON.stringify(trans));
    addTranHist(tran.id, source, amount, tran.time);
}

form.addEventListener("submit", event => {
    event.preventDefault();
    if(form.source.value.trim() === "" || form.amount.value === ""){
        vmsg.innerText = "Please input values!";
      //  return alert("Please input values!");
    }
    addTran(form.source.value.trim(), Number(form.amount.value));
    updTotals();
    form.reset();
    vmsg.innerText = "";
})

function getTran(){
    trans.forEach(tran => {
        if(tran.amount > 0){
            incomeList.innerHTML += genHist(tran.id, tran.source, tran.amount, tran.time);
        } else {
            expenseList.innerHTML += genHist(tran.id, tran.source, tran.amount, tran.time);
        }
    });
}

function delTran(id){
    trans = trans.filter(tran => {
        //console.log(tran.id, id);
        return tran.id !== id;
    });
    //console.log(trans);
    localStorage.setItem("trans", JSON.stringify(trans));
}

incomeList.addEventListener("click", event => {
    if(event.target.classList.contains("delete")){
        //console.log(event.target);
        event.target.parentElement.remove();
        delTran(Number(event.target.parentElement.dataset.id));
        updTotals();
    }
});

expenseList.addEventListener("click", event => {
    if(event.target.classList.contains("delete")){
        //console.log(event.target);
        event.target.parentElement.remove();
        delTran(Number(event.target.parentElement.dataset.id));
        updTotals();
    }
});


function init(){
    updTotals();
    getTran();
}

init();

