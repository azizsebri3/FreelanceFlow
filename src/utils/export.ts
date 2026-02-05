/* ==========================================================================
   PDF Export Utility
   Generates PDF reports from dashboard content
   ========================================================================== */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  title?: string;
  filename?: string;
  includeCharts?: boolean;
  includeStats?: boolean;
  includeTables?: boolean;
}

/**
 * Export dashboard content to PDF
 */
export async function exportDashboardToPDF(options: ExportOptions = {}) {
  const {
    title = 'FreelanceFlow Dashboard Report',
    filename = `freelanceflow-report-${new Date().toISOString().split('T')[0]}.pdf`,
    includeCharts = true,
    includeStats = true,
    includeTables = true,
  } = options;

  try {
    // Create new PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Add title
    pdf.setFontSize(20);
    pdf.setTextColor(60, 80, 224); // Primary color
    pdf.text(title, 20, yPosition);
    yPosition += 15;

    // Add date
    pdf.setFontSize(12);
    pdf.setTextColor(100, 116, 139); // Gray color
    pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 20;

    // Add dashboard summary data instead of screenshot
    pdf.setFontSize(14);
    pdf.setTextColor(60, 80, 224);
    pdf.text('Dashboard Overview', 20, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setTextColor(71, 85, 105);

    // Add key metrics
    const metrics = [
      { label: 'Total Clients', value: '48', change: '+12%' },
      { label: 'Active Projects', value: '12', change: '+8' },
      { label: 'Monthly Revenue', value: '$24,580', change: '+15.3%' },
      { label: 'Unpaid Invoices', value: '7', change: '-3' },
    ];

    metrics.forEach(metric => {
      pdf.setFontSize(11);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`${metric.label}: ${metric.value} (${metric.change})`, 20, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Add recent projects
    pdf.setFontSize(14);
    pdf.setTextColor(60, 80, 224);
    pdf.text('Recent Projects', 20, yPosition);
    yPosition += 15;

    const projects = [
      { name: 'E-Commerce Platform', client: 'TechCorp Inc.', status: 'In Progress', progress: '75%' },
      { name: 'Mobile App Development', client: 'StartupXYZ', status: 'In Progress', progress: '60%' },
      { name: 'Brand Identity Design', client: 'Local Business Co.', status: 'Completed', progress: '100%' },
    ];

    projects.forEach(project => {
      pdf.setFontSize(11);
      pdf.setTextColor(71, 85, 105);
      pdf.text(`${project.name} - ${project.client} (${project.status})`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Progress: ${project.progress}`, 30, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Add summary section
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(14);
    pdf.setTextColor(60, 80, 224);
    pdf.text('Report Summary', 20, yPosition);
    yPosition += 12;

    pdf.setFontSize(11);
    pdf.setTextColor(71, 85, 105);
    const summaryText = [
      'This report provides a snapshot of your FreelanceFlow dashboard metrics.',
      'For interactive charts, detailed analytics, and real-time updates,',
      'please access your dashboard at http://localhost:3000',
      '',
      'Generated automatically on ' + new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    ];

    summaryText.forEach(line => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += 6;
    });

    // Save the PDF
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Export specific data to CSV
 */
export function exportDataToCSV(data: any[], filename: string, headers?: string[]) {
  try {
    let csvContent = '';

    // Add headers if provided
    if (headers && headers.length > 0) {
      csvContent += headers.join(',') + '\n';
    }

    // Add data rows
    data.forEach(row => {
      const values = Array.isArray(row) ? row : Object.values(row);
      const csvRow = values.map(value => {
        // Escape commas and quotes in values
        const stringValue = String(value || '');
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvContent += csvRow.join(',') + '\n';
    });

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, filename };
  } catch (error) {
    console.error('Error generating CSV:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Export invoice to PDF
 */
export async function exportInvoiceToPDF(invoice: {
  invoiceNumber: string;
  client: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  issuedDate: string;
  workItems: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  logoUrl?: string;
  notes?: string;
  taxRate?: number;
}) {
  const filename = `${invoice.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Logo (if provided)
    if (invoice.logoUrl) {
      try {
        // Add logo at the top right
        pdf.addImage(invoice.logoUrl, 'JPEG', pageWidth - 50, yPosition, 30, 30);
        yPosition += 35;
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
        yPosition += 10;
      }
    }

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(60, 80, 224); // Primary color
    pdf.text('INVOICE', 20, yPosition);
    yPosition += 20;

    // Invoice details
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);

    // Invoice number and dates
    pdf.text(`Invoice Number: ${invoice.invoiceNumber}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Issue Date: ${new Date(invoice.issuedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 20, yPosition);
    yPosition += 20;

    // Client info
    pdf.setFontSize(14);
    pdf.setTextColor(60, 80, 224);
    pdf.text('Bill To:', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(invoice.client, 20, yPosition);
    yPosition += 20;

    // Work Items Table
    pdf.setFontSize(14);
    pdf.setTextColor(60, 80, 224);
    pdf.text('Work Items:', 20, yPosition);
    yPosition += 10;

    // Table headers
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Description', 20, yPosition);
    pdf.text('Qty', 120, yPosition);
    pdf.text('Rate', 140, yPosition);
    pdf.text('Amount', 170, yPosition);
    yPosition += 8;

    // Table line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 5;

    // Work items
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    invoice.workItems.forEach((item) => {
      // Description (truncate if too long)
      const description = item.description.length > 50
        ? item.description.substring(0, 47) + '...'
        : item.description;
      pdf.text(description, 20, yPosition);

      // Quantity, Rate, Amount
      pdf.text(item.quantity.toString(), 120, yPosition);
      pdf.text(`$${item.rate.toFixed(2)}`, 140, yPosition);
      pdf.text(`$${item.amount.toFixed(2)}`, 170, yPosition);

      yPosition += 8;
    });

    // Subtotal
    yPosition += 5;
    pdf.setDrawColor(200, 200, 200);
    pdf.line(140, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;

    const subtotal = invoice.workItems.reduce((sum, item) => sum + item.amount, 0);
    pdf.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, yPosition);

    // Tax
    if (invoice.taxRate && invoice.taxRate > 0) {
      yPosition += 8;
      const taxAmount = subtotal * (invoice.taxRate / 100);
      pdf.text(`Tax (${invoice.taxRate}%): $${taxAmount.toFixed(2)}`, 140, yPosition);
      yPosition += 8;
    }

    // Total
    yPosition += 5;
    pdf.setDrawColor(60, 80, 224);
    pdf.setLineWidth(0.5);
    pdf.line(140, yPosition, pageWidth - 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(12);
    pdf.setTextColor(60, 80, 224);
    pdf.text(`Total: $${invoice.amount.toFixed(2)}`, 140, yPosition);
    yPosition += 20;

    // Status
    pdf.setFontSize(12);
    const statusColor = invoice.status === 'paid' ? [34, 197, 94] : invoice.status === 'overdue' ? [239, 68, 68] : [245, 158, 11];
    pdf.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    pdf.text(`Status: ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}`, 20, yPosition);
    yPosition += 20;

    // Notes
    if (invoice.notes) {
      pdf.setFontSize(12);
      pdf.setTextColor(60, 80, 224);
      pdf.text('Notes:', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      const notesLines = pdf.splitTextToSize(invoice.notes, pageWidth - 40);
      pdf.text(notesLines, 20, yPosition);
    }

    // Footer
    const footerY = pdf.internal.pageSize.getHeight() - 20;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });

    // Save the PDF
    pdf.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error('Error generating invoice PDF:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}