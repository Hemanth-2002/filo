import type { DocumentRequirement } from '@/types'

export function getDocumentRequirementsFromTask(taskTitle: string): DocumentRequirement[] {
  // Extract task type and period from title
  const isGST = taskTitle.toLowerCase().includes('gstr') || taskTitle.toLowerCase().includes('gst')
  
  if (isGST) {
    return [
      {
        id: 'sales-register',
        name: 'Sales Register',
        description: 'Should include all B2B and B2C invoices. Invoice date must fall between 01 Apr 2025 – 30 Apr 2025',
        format: 'Excel or PDF',
        required: true,
        uploaded: false,
      },
      {
        id: 'purchase-register',
        name: 'Purchase Register',
        description: 'Include GST details of vendors',
        format: 'Excel or PDF',
        required: true,
        uploaded: false,
      },
      {
        id: 'expense-bills',
        name: 'Expense Bills',
        description: 'Purchase invoices, rent, electricity, freight, etc. Clear and readable images or PDFs',
        format: 'Images or PDFs',
        required: true,
        uploaded: false,
      },
      {
        id: 'bank-statement',
        name: 'Bank Statement',
        description: 'April 2025 only. All pages required',
        format: 'PDF preferred',
        required: true,
        uploaded: false,
      },
      {
        id: 'credit-debit-notes',
        name: 'Credit/Debit Note',
        description: 'Credit or debit notes issued or received in April 2025',
        format: 'PDF or Images',
        required: false,
        uploaded: false,
      },
    ]
  }

  // Default documents for other task types
  return [
    {
      id: 'document-1',
      name: 'Document 1',
      required: true,
      uploaded: false,
    },
  ]
}

