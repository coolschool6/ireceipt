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
    <div class="receipt-box" style="background:#fff;padding:2em 1em 1em 1em;max-width:700px;margin:auto;box-shadow:0 2px 8px rgba(0,0,0,0.07);">
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:0.5em;">
        <div style="min-width:0;max-width:60%;word-break:break-word;">
          <span style="font-size:1.3em;font-weight:bold;word-break:break-word;">${receipt.businessName}</span><br>
          <span style="font-style:italic;color:#0074D9;word-break:break-word;">${receipt.businessOwner}</span>
        </div>
        <div style="text-align:right;min-width:120px;max-width:38%;word-break:break-word;">
          <span style="font-size:1.2em;font-weight:bold;color:#888;">Receipt</span><br>
          <span style="font-size:1em;white-space:nowrap;">Date: ${formatDate(receipt.receiptDate)}</span>
        </div>
      </div>
      <div style="margin:2em 0 1em 0;display:flex;justify-content:space-between;">
        <div><span style="font-weight:bold;font-style:italic;">To:</span> <span style="font-weight:bold;font-style:italic;">${receipt.customerName}</span></div>
        <div><span style="font-weight:bold;">FOR:</span> <span style="font-weight:bold;">${receipt.receiptFor}</span></div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:1em;">
        <thead>
          <tr style="background:#f2f2f2;">
            <th style="text-align:left;padding:0.5em;border:1px solid #333;">DESCRIPTION</th>
            <th style="text-align:right;padding:0.5em;border:1px solid #333;">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          ${(receipt.items || [{description: receipt.productDescription, amount: receipt.totalAmount}]).map(item => `
            <tr>
              <td style='padding:0.5em;border:1px solid #333;'>${item.description}</td>
              <td style='padding:0.5em;text-align:right;border:1px solid #333;'>$${item.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding:0.5em;font-weight:bold;border:1px solid #333;">Total Paid</td>
            <td style="padding:0.5em;text-align:right;font-weight:bold;border:1px solid #333;">$${receipt.totalAmount.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      <button id="deleteReceiptBtn" style="background:#c0392b;color:#fff;border:none;border-radius:4px;padding:0.7em;width:100%;margin-bottom:1em;">Delete Receipt</button>
    </div>
  `;
  // Delete button logic
  document.getElementById('deleteReceiptBtn').onclick = function() {
    if (confirm('Delete this receipt?')) {
      let receipts = JSON.parse(localStorage.getItem('receipts') || '[]');
      receipts = receipts.filter(r => r.id !== receipt.id);
      localStorage.setItem('receipts', JSON.stringify(receipts));
      window.location.href = 'index.html';
    }
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.getFullYear();
  return `${day} ${month},${year}`;
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
