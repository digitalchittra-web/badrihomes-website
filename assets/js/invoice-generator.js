// Invoice Generator for Badri Homes

class InvoiceGenerator {
  constructor() {
    this.invoiceCounter = 0;
    this.loadInvoiceCounter();
  }

  loadInvoiceCounter() {
    const saved = localStorage.getItem('badri_invoice_counter');
    this.invoiceCounter = saved ? parseInt(saved) : 100;
  }

  saveInvoiceCounter() {
    localStorage.setItem('badri_invoice_counter', this.invoiceCounter);
  }

  getNextInvoiceNumber() {
    this.invoiceCounter++;
    this.saveInvoiceCounter();
    return String(this.invoiceCounter).padStart(4, '0');
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  generateReceiptHTML(data) {
    const invoiceNumber = data.invoiceNumber || this.getNextInvoiceNumber();
    const guestName = data.guestName || 'Guest';
    const checkIn = this.formatDate(data.checkIn);
    const checkOut = this.formatDate(data.checkOut);
    const nights = this.calculateNights(data.checkIn, data.checkOut);
    const ratePerNight = parseFloat(data.ratePerNight) || 0;
    const totalAmount = nights * ratePerNight;
    const todayDate = this.formatDate(new Date());

    const roomsHTML = data.rooms.map((room, index) => {
      const roomTotal = room.nights * room.rate;
      return `
        <tr>
          <td style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Service Fee [Room No. ${String(room.number).padStart(3, '0')}]</td>
          <td style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">${this.formatCurrency(room.rate)}</td>
          <td style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">${room.nights}</td>
          <td style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">${this.formatCurrency(roomTotal)}</td>
        </tr>
      `;
    }).join('');

    const grandTotal = data.rooms.reduce((sum, room) => sum + (room.nights * room.rate), 0);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${invoiceNumber} - Badri Homes</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f0eb;
      padding: 20px;
    }
    .invoice-container {
      background: white;
      max-width: 900px;
      margin: 0 auto;
      padding: 50px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    .invoice-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 50px;
      align-items: start;
    }
    .company-info {
      border-right: 2px solid #e0d6cc;
      padding-right: 40px;
    }
    .company-info h1 {
      font-size: 28px;
      color: #2C1810;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .company-details {
      font-size: 13px;
      color: #666;
      line-height: 1.8;
    }
    .company-details strong {
      color: #2C1810;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta h2 {
      font-size: 32px;
      color: #C4704F;
      margin-bottom: 20px;
      font-weight: 400;
      letter-spacing: 2px;
    }
    .meta-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
      font-size: 13px;
      color: #333;
    }
    .meta-label {
      font-weight: 600;
      width: 120px;
      text-align: right;
      margin-right: 15px;
      color: #2C1810;
    }
    .meta-value {
      width: 150px;
      text-align: right;
      border-bottom: 1px solid #ddd;
      padding-bottom: 4px;
    }
    .invoice-to {
      margin-bottom: 40px;
      padding: 20px 0;
      border-top: 2px solid #e0d6cc;
      border-bottom: 2px solid #e0d6cc;
    }
    .invoice-to p {
      font-size: 12px;
      color: #888;
      margin-bottom: 5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .invoice-to h3 {
      font-size: 16px;
      color: #2C1810;
      margin-bottom: 15px;
    }
    .invoice-to .details {
      font-size: 13px;
      color: #555;
      line-height: 1.8;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 13px;
    }
    .invoice-table thead {
      background: #8B5D3F;
      color: white;
    }
    .invoice-table th {
      padding: 15px;
      text-align: left;
      font-weight: 600;
      border: none;
    }
    .invoice-table th:nth-child(2),
    .invoice-table th:nth-child(3),
    .invoice-table th:nth-child(4) {
      text-align: center;
    }
    .invoice-table th:last-child {
      text-align: right;
    }
    .invoice-table td {
      padding: 15px;
      border-bottom: 1px solid #e0d6cc;
    }
    .invoice-table td:nth-child(2),
    .invoice-table td:nth-child(3),
    .invoice-table td:nth-child(4) {
      text-align: center;
    }
    .invoice-table td:last-child {
      text-align: right;
    }
    .invoice-table tbody tr:hover {
      background: #f9f7f4;
    }
    .invoice-summary {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    .summary-box {
      width: 300px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e0d6cc;
      font-size: 13px;
    }
    .summary-row.total {
      background: #8B5D3F;
      color: white;
      padding: 15px;
      border-radius: 4px;
      border: none;
      font-weight: 600;
      font-size: 14px;
      margin-top: 5px;
    }
    .summary-row.total span:first-child {
      font-weight: 600;
    }
    .invoice-footer {
      text-align: center;
      padding-top: 30px;
      border-top: 2px solid #e0d6cc;
      color: #666;
      font-size: 12px;
      line-height: 1.8;
    }
    .invoice-footer strong {
      color: #2C1810;
    }
    .invoice-footer .thanks {
      font-size: 14px;
      font-weight: 600;
      color: #2C1810;
      margin-top: 10px;
    }
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 30px;
      padding-top: 30px;
      border-top: 2px solid #e0d6cc;
    }
    .btn {
      padding: 11px 24px;
      border-radius: 6px;
      border: none;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .btn-print {
      background: #C4704F;
      color: white;
    }
    .btn-print:hover {
      background: #B5603F;
    }
    .btn-download {
      background: #2C1810;
      color: white;
    }
    .btn-download:hover {
      background: #1a0e07;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        padding: 0;
      }
      .action-buttons {
        display: none;
      }
    }
    @media (max-width: 768px) {
      .invoice-container {
        padding: 30px 20px;
      }
      .invoice-header {
        grid-template-columns: 1fr;
        gap: 30px;
      }
      .company-info {
        border-right: none;
        border-bottom: 2px solid #e0d6cc;
        padding-right: 0;
        padding-bottom: 30px;
      }
      .invoice-meta {
        text-align: left;
      }
      .meta-row {
        justify-content: flex-start;
      }
      .meta-label {
        text-align: left;
      }
      .meta-value {
        text-align: left;
      }
      .invoice-summary {
        justify-content: center;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="invoice-header">
      <div class="company-info">
        <h1>Badri Homes</h1>
        <div class="company-details">
          <p><strong>Saugal Tole, Patan</strong></p>
          <p>Lalitpur, Nepal</p>
          <p><strong>PAN:</strong> 620563215</p>
          <p><strong>Registration:</strong> 177183</p>
          <p><strong>Email:</strong> homesbadri@gmail.com</p>
          <p><strong>Phone:</strong> +977 9851047861</p>
        </div>
      </div>
      <div class="invoice-meta">
        <h2>INVOICE</h2>
        <div class="meta-row">
          <span class="meta-label">DATE</span>
          <span class="meta-value">${todayDate}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">INVOICE #</span>
          <span class="meta-value">${invoiceNumber}</span>
        </div>
      </div>
    </div>

    <!-- Bill To -->
    <div class="invoice-to">
      <p>Bill To:</p>
      <h3>${guestName}</h3>
      <div class="details">
        <p><strong>Check-in:</strong> ${checkIn}</p>
        <p><strong>Check-out:</strong> ${checkOut}</p>
        <p><strong>Duration:</strong> ${nights} night${nights !== 1 ? 's' : ''}</p>
      </div>
    </div>

    <!-- Table -->
    <table class="invoice-table">
      <thead>
        <tr>
          <th>DESCRIPTION</th>
          <th>RATE</th>
          <th>NO. OF NIGHTS</th>
          <th>AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        ${roomsHTML}
      </tbody>
    </table>

    <!-- Summary -->
    <div class="invoice-summary">
      <div class="summary-box">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${this.formatCurrency(grandTotal)}</span>
        </div>
        <div class="summary-row total">
          <span>TOTAL</span>
          <span>${this.formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="invoice-footer">
      <p><strong>Thank you for your business!</strong></p>
      <p>If you have any questions about this invoice, please contact Badri Homes</p>
      <p>homesbadri@gmail.com | +977 9851047861</p>
      <p class="thanks">Thank You For Your Business!</p>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button class="btn btn-print" onclick="window.print()">🖨️ Print</button>
      <button class="btn btn-download" onclick="downloadPDF('invoice-${invoiceNumber}')">⬇️ Download PDF</button>
    </div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf/0.10.1/html2pdf.bundle.min.js"></script>
  <script>
    function downloadPDF(filename) {
      const element = document.querySelector('.invoice-container');
      const opt = {
        margin: 10,
        filename: filename + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      html2pdf().set(opt).from(element).save();
    }
  </script>
</body>
</html>
    `;
  }

  // Generate receipt and display in new window
  generateAndDisplay(data) {
    const html = this.generateReceiptHTML(data);
    const newWindow = window.open('', '', 'width=900,height=1000');
    newWindow.document.write(html);
    newWindow.document.close();
    return newWindow;
  }

  // Generate receipt and return as string
  generateHTML(data) {
    return this.generateReceiptHTML(data);
  }
}

// Export for use
window.InvoiceGenerator = InvoiceGenerator;
