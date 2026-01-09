import type { ChatMessage } from '@/types'
import { storageUtils } from './storage'

const mockAIResponses = [
  "Sure. I'll help you with that. Just to confirm, is this for a monthly GST return (GSTR-1 and GSTR-3B)?",
  `Thanks. I have identified this as **GST Monthly Return - April 2025**. I'll now guide you step by step. Creating a Checklist and task for you to upload all the required documents needed to file the GST.`,
  `Please upload the following documents for April 2025:

1. **Sales Register**
   - Format: Excel or PDF
   - Content: B2B and B2C invoices
   - Date Range: 01 Apr 2025 - 30 Apr 2025

2. **Purchase Register**
   - Format: Excel or PDF
   - Content: GST details of vendors

3. **Expense Bills**
   - Examples: purchase invoices, rent, electricity, freight
   - Format: clear and readable images or PDFs

4. **Bank Statement**
   - Period: April 2025 only
   - Requirement: all pages
   - Preference: PDF

**Optional (If Applicable):**
- Credit or debit notes issued or received in April 2025

You can upload files one by one. I'll check them instantly and let me know if anything needs correction.`,
  "I've received your documents. Let me review them and get back to you shortly.",
  `Your documents look good! I've verified the following:

✅ Sales Register - Complete
✅ Purchase Register - Complete  
✅ Expense Bills - All attached
✅ Bank Statement - Verified

**Next Steps:**
1. I'll prepare your GSTR-3B return
2. Review the calculations
3. Share the draft for your approval

This should take approximately 2-3 business days.`,
  `# GST Return Filing Guide

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

\`\`\`javascript
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
\`\`\`

## Common Issues

- **Late Filing**: Penalty of ₹200 per day (max ₹5,000)
- **Incorrect Data**: Can lead to notices from tax department
- **Missing Documents**: May delay the filing process

## Need Help?

If you have any questions, feel free to ask. You can also visit the [GST Portal](https://www.gst.gov.in) for official information.

---

**Note**: This is a sample guide. Always consult with a CA for specific advice.`,
]

// Track response index per request
const responseIndices: Record<string, number> = {}

export function getMockAIResponse(requestId: string): string {
  if (!responseIndices[requestId]) {
    responseIndices[requestId] = 0
  }
  
  const index = responseIndices[requestId] % mockAIResponses.length
  const response = mockAIResponses[index]
  responseIndices[requestId]++
  
  return response
}

export function initializeMockChat(requestId: string, userMessage?: string): ChatMessage[] {
  // Check if chat already exists
  const existing = storageUtils.getChatMessages(requestId)
  if (existing.length > 0) {
    return existing
  }

  const messages: ChatMessage[] = []

  // Add user's initial message if provided
  if (userMessage) {
    messages.push({
      id: `msg-${Date.now()}-user`,
      role: 'user',
      message: userMessage,
      timestamp: new Date().toISOString(),
    })
  }

  // Add AI's first response
  messages.push({
    id: `msg-${Date.now()}-ai`,
    role: 'AI',
    message: mockAIResponses[0],
    timestamp: new Date().toISOString(),
  })

  return messages
}

