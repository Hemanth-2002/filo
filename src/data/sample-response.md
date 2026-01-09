# GST Return Filing Guide

This guide will help you understand the **GST return filing process** step by step.

## Overview

GST (Goods and Services Tax) returns must be filed monthly or quarterly depending on your business type. The most common returns are:

- **GSTR-1**: Details of outward supplies
- **GSTR-3B**: Summary return with tax payment
- **GSTR-9**: Annual return

## Required Documents

### 1. Sales Register
- Format: Excel or PDF
- Content: All B2B and B2C invoices
- Date Range: Must match the return period

### 2. Purchase Register
- Format: Excel or PDF  
- Content: GST details of all vendors
- Include: Invoice numbers, dates, and GSTIN

### 3. Expense Bills
Examples include:
- Purchase invoices
- Rent receipts
- Electricity bills
- Freight charges

### 4. Bank Statement
- Period: Must match the return period
- Requirement: All pages in PDF format
- Ensure: All transactions are clearly visible

## Step-by-Step Process

1. **Gather Documents**: Collect all invoices and bills for the period
2. **Verify Data**: Check that all invoices have valid GSTIN
3. **Calculate Tax**: Compute CGST, SGST, and IGST
4. **File Return**: Submit through GST portal
5. **Make Payment**: Pay any tax due before the deadline

## Important Dates

| Return Type | Due Date | Frequency |
|------------|----------|-----------|
| GSTR-1 | 11th of next month | Monthly |
| GSTR-3B | 20th of next month | Monthly |
| GSTR-9 | 31st December | Annual |

## Code Example

Here's a sample calculation:

```javascript
function calculateGST(amount, rate) {
  const gst = (amount * rate) / 100;
  const cgst = gst / 2;
  const sgst = gst / 2;
  return {
    total: amount + gst,
    cgst: cgst,
    sgst: sgst,
    igst: gst // For inter-state transactions
  };
}
```

## Common Issues

- **Late Filing**: Penalty of ₹200 per day (max ₹5,000)
- **Incorrect Data**: Can lead to notices from tax department
- **Missing Documents**: May delay the filing process

## Need Help?

If you have any questions, feel free to ask. You can also visit the [GST Portal](https://www.gst.gov.in) for official information.

---

**Note**: This is a sample guide. Always consult with a CA for specific advice.

