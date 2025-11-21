// Loads and displays a read-only receipt
function getReceiptById(id) {
  const receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
  return receipts.find(r => r.id === id);
}

function renderReceipt(receipt) {
  if (!receipt) {
    document.getElementById('receiptContainer').innerHTML = '<p>Receipt not found.</p>';
    document.getElementById('sendWhatsappBtn').style.display = 'none';
    return;
  }
  document.getElementById('receiptContainer').innerHTML = `
    <div class="receipt-box">
      <h2>${receipt.businessName}</h2>
      <p><strong>Owner:</strong> ${receipt.businessOwner}</p>
      <hr>
      <h3>Receipt</h3>
      <p><strong>Date:</strong> ${receipt.receiptDate}</p>
      <p><strong>Customer:</strong> ${receipt.customerName} (${receipt.customerNumber})</p>
      <p><strong>For:</strong> ${receipt.receiptFor}</p>
      <p><strong>Description:</strong> ${receipt.productDescription}</p>
      <p><strong>Total Amount:</strong> $${receipt.totalAmount}</p>
    </div>
  `;
}

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const receipt = getReceiptById(id);
renderReceipt(receipt);

document.getElementById('sendWhatsappBtn').onclick = function() {
  const url = window.location.href;
  const msg = `Here is your receipt: ${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
};
