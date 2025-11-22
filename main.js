// Handles receipt creation, storage, and navigation
function generateUniqueId() {
  return 'r_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

function saveReceipt(receipt) {
  const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  receipts.push(receipt);
  localStorage.setItem('receipts', JSON.stringify(receipts));
}

function getReceipts() {
  return JSON.parse(localStorage.getItem('receipts') || '[]');
}

document.getElementById('receiptForm').onsubmit = function(e) {
  e.preventDefault();
  // Gather items
  const itemDescriptions = Array.from(document.getElementsByClassName('itemDescription'));
  const itemAmounts = Array.from(document.getElementsByClassName('itemAmount'));
  const items = [];
  for (let i = 0; i < itemDescriptions.length; i++) {
    if (itemDescriptions[i].value && itemAmounts[i].value) {
      items.push({
        description: itemDescriptions[i].value,
        amount: parseFloat(itemAmounts[i].value)
      });
    }
  }
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const receipt = {
    id: generateUniqueId(),
    businessName: document.getElementById('businessName').value,
    businessOwner: document.getElementById('businessOwner').value,
    customerName: document.getElementById('customerName').value,
    customerNumber: document.getElementById('customerNumber').value,
    receiptDate: document.getElementById('receiptDate').value || new Date().toISOString().slice(0,10),
    receiptFor: document.getElementById('receiptFor').value,
    items: items,
    totalAmount: totalAmount
  };
  saveReceipt(receipt);
  localStorage.setItem('lastReceiptId', receipt.id);
  document.getElementById('createReceiptSection').style.display = 'none';
  document.getElementById('afterGeneration').style.display = 'block';
  // Reset form for next receipt
  document.getElementById('createAnotherBtn').onclick = function() {
    document.getElementById('receiptForm').reset();
    // Remove extra item rows except the first
    const itemsGroup = document.getElementById('itemsGroup');
    while (itemsGroup.children.length > 1) {
      itemsGroup.removeChild(itemsGroup.lastChild);
    }
    itemsGroup.querySelector('.removeItemBtn').style.display = 'none';
    document.getElementById('afterGeneration').style.display = 'none';
    document.getElementById('createReceiptSection').style.display = 'block';
  };
}
// Add item row logic
document.getElementById('addItemBtn').onclick = function() {
  const itemsGroup = document.getElementById('itemsGroup');
  const newRow = document.createElement('div');
  newRow.className = 'item-row';
  newRow.innerHTML = `<input type="text" class="itemDescription" placeholder="Item Description" required> <input type="number" class="itemAmount" placeholder="Amount" required> <button type="button" class="removeItemBtn">Remove</button>`;
  itemsGroup.appendChild(newRow);
  updateRemoveButtons();
};

function updateRemoveButtons() {
  const removeBtns = document.querySelectorAll('.removeItemBtn');
  removeBtns.forEach((btn, idx) => {
    btn.style.display = (removeBtns.length > 1) ? 'inline-block' : 'none';
    btn.onclick = function() {
      btn.parentElement.remove();
      updateRemoveButtons();
    };
  });
}
updateRemoveButtons();

document.getElementById('viewReceiptBtn').onclick = function() {
  const id = localStorage.getItem('lastReceiptId');
  window.location.href = `receipt.html?id=${id}`;
};

document.getElementById('sendWhatsappBtn').onclick = function() {
  const id = localStorage.getItem('lastReceiptId');
  const receipts = getReceipts();
  const receipt = receipts.find(r => r.id === id);
  if (!receipt) return;
  const url = window.location.origin + '/receipt.html?id=' + id;
  const msg = `Here is your receipt: ${url}`;
  // Use WhatsApp direct chat with customer number
  const phone = receipt.customerNumber.replace(/[^\d]/g, ''); // Remove non-digits
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
};

document.getElementById('viewReceiptsBtn').onclick = function() {
  document.getElementById('createReceiptSection').style.display = 'none';
  document.getElementById('afterGeneration').style.display = 'none';
  document.getElementById('receiptsListSection').style.display = 'block';
  const receipts = getReceipts();
  const list = document.getElementById('receiptsList');
  list.innerHTML = '';
  receipts.forEach(r => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="receipt.html?id=${r.id}">${r.businessName} - ${r.customerName} (${r.receiptDate})</a> <button class='deleteBtn' data-id='${r.id}' style='background:#c0392b;color:#fff;border:none;border-radius:4px;padding:0.3em 0.7em;margin-left:1em;'>Delete</button>`;
    list.appendChild(li);
  });
  // Add delete logic
  Array.from(document.getElementsByClassName('deleteBtn')).forEach(btn => {
    btn.onclick = function() {
      const id = this.getAttribute('data-id');
      let receipts = getReceipts();
      receipts = receipts.filter(r => r.id !== id);
      localStorage.setItem('receipts', JSON.stringify(receipts));
      document.getElementById('viewReceiptsBtn').click();
    };
  });
  // Delete all receipts
  const deleteAllBtn = document.getElementById('deleteAllBtn');
  if (deleteAllBtn) {
    deleteAllBtn.onclick = function() {
      if (confirm('Delete all receipts?')) {
        localStorage.removeItem('receipts');
        document.getElementById('viewReceiptsBtn').click();
      }
    };
  }
  // Back button logic
  setTimeout(() => {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
      backBtn.onclick = function() {
        document.getElementById('receiptsListSection').style.display = 'none';
        document.getElementById('createReceiptSection').style.display = 'block';
      };
    }
  }, 0);
};
