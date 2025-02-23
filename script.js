const balanceElement = document.getElementById('balance');
const amountInput = document.getElementById('amount-input');
const descriptionInput = document.getElementById('description-input');
const addIncomeButton = document.getElementById('add-income');
const addExpenseButton = document.getElementById('add-expense');
const resetTransactionButton = document.getElementById('reset-transaction');
const transactionList = document.getElementById('transaction-list');

let balance = 0;
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateBalance() {
    const formattedBalance = balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    balanceElement.innerHTML = `Uang: <span class="currency-symbol">Rp</span><span class="currency-value">${formattedBalance.slice(3)}</span>`;
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function renderTransactions() {
    transactionList.innerHTML = '';
    transactions.forEach(transaction => {
        const transactionItem = document.createElement('li');
        transactionItem.classList.add(transaction.type);
        transactionItem.innerHTML = `
            <div>
                <span>${transaction.type === 'income' ? '+' : '-'} ${transaction.amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                <span>${transaction.description}</span>
            </div>
            <div class="transaction-timestamp">${transaction.timestamp}</div>
        `;
        transactionList.appendChild(transactionItem);
    });
}

function addTransaction(type) {
    const amount = parseFloat(amountInput.value.trim());
    const description = descriptionInput.value.trim();

    if (isNaN(amount) || amount <= 0 || description === '') {
        alert('Masukkan jumlah uang dan deskripsi yang valid!');
        return;
    }

    const currentDateTime = new Date();
    const timestamp = currentDateTime.toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const transaction = { type, amount, description, timestamp };
    transactions.push(transaction);
    saveTransactions();
    renderTransactions();

    balance += type === 'income' ? amount : -amount;
    updateBalance();

    amountInput.value = '';
    descriptionInput.value = '';
}

function resetTransactions() {
    transactions = [];
    balance = 0;
    saveTransactions();
    renderTransactions();
    updateBalance();
}

addIncomeButton.addEventListener('click', () => addTransaction('income'));
addExpenseButton.addEventListener('click', () => addTransaction('expense'));
resetTransactionButton.addEventListener('click', resetTransactions);

window.addEventListener('DOMContentLoaded', () => {
    transactions.forEach(transaction => {
        balance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    });
    renderTransactions();
    updateBalance();
});

function formatCurrency(value) {
    let formattedValue = value.replace(/\D/g, '');
    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formattedValue;
}

amountInput.addEventListener('input', (event) => {
    let value = event.target.value;
    value = formatCurrency(value);
    amountInput.value = value;
});
