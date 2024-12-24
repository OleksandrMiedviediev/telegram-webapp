let wallet = null;
let balance = 0;

// Загрузка данных при инициализации
document.addEventListener('DOMContentLoaded', () => {
  const savedWallet = localStorage.getItem('wallet');
  const savedBalance = parseFloat(localStorage.getItem('balance')) || 0;

  if (savedWallet) {
    wallet = savedWallet;
    document.getElementById('wallet-input').value = wallet;
    document.getElementById('withdraw-btn').disabled = false;
  }

  balance = savedBalance;
  updateBalanceDisplay();
});

// Обновление баланса на экране
function updateBalanceDisplay() {
  document.getElementById('balance-display').textContent = `Ваш баланс: ${balance.toFixed(2)} USDT`;
}

// Сохранение кошелька
document.getElementById('save-wallet-btn').addEventListener('click', () => {
  const inputWallet = document.getElementById('wallet-input').value.trim();

  if (inputWallet.length < 10) {
    alert('Введите корректный адрес кошелька!');
    return;
  }

  wallet = inputWallet;
  localStorage.setItem('wallet', wallet);
  document.getElementById('withdraw-btn').disabled = false;
  alert('Кошелек сохранен!');
});

// Эмуляция просмотра рекламы
setInterval(() => {
  balance += 0.05; // Добавляем 0.05 USDT за каждую "рекламу"
  localStorage.setItem('balance', balance);
  updateBalanceDisplay();
}, 30000); // Каждые 30 секунд

// Запрос на вывод средств
document.getElementById('withdraw-btn').addEventListener('click', () => {
  if (!wallet) {
    alert('Добавьте криптокошелек для вывода средств!');
    return;
  }

  fetch('http://localhost:3000/withdraw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallet: wallet,
      amount: balance,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('Запрос на вывод принят!');
        balance = 0; // Обнуляем баланс
        localStorage.setItem('balance', balance);
        updateBalanceDisplay();
      } else {
        alert('Ошибка: ' + data.message);
      }
    })
    .catch((error) => console.error('Ошибка:', error));
});