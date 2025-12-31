import { useState, useCallback } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import ExportDocumentTable from '../components/ExportDocumentTable';
import ExportDocumentTableHeader from '../components/ExportDocumentTableHeader';
import { useExportDocumentsTable } from '../hooks/useExportDocumentsTable';
import type { ExportDocument } from '../types';
import type { ExportDocumentStatusFilter } from '../types/filters';

// Mock data - TODO: Replace with API call
const getMockExportDocuments = (): ExportDocument[] => [
  {
    id: '1',
    documentNo: 'INV-001',
    documentType: 'invoice',
    exportOrderId: '1',
    exportOrderNo: 'XK001',
    customerId: 'customer-001',
    customerName: 'Công ty ABC International',
    invoiceDate: new Date('2024-01-15'),
    currency: 'USD',
    totalAmount: 50000,
    status: 'issued'
  },
  {
    id: '2',
    documentNo: 'PKG-001',
    documentType: 'packing-list',
    exportOrderId: '1',
    exportOrderNo: 'XK001',
    customerId: 'customer-001',
    customerName: 'Công ty ABC International',
    invoiceDate: new Date('2024-01-15'),
    currency: 'USD',
    totalAmount: 50000,
    packageCount: 10,
    grossWeight: 5000,
    netWeight: 4500,
    status: 'draft'
  },
  {
    id: '3',
    documentNo: 'INV-002',
    documentType: 'invoice',
    exportOrderId: '2',
    exportOrderNo: 'XK002',
    customerId: 'customer-002',
    customerName: 'XYZ Trading Co., Ltd.',
    invoiceDate: new Date('2024-01-20'),
    currency: 'EUR',
    totalAmount: 75000,
    status: 'draft'
  }
];

// ==============================|| EXPORT DOCUMENTS LIST PAGE ||============================== //

const ExportDocumentsListPage = () => {
  const [documents, setDocuments] = useState<ExportDocument[]>(getMockExportDocuments());
  const [isLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ExportDocumentStatusFilter>('all');
  const [searchValue, setSearchValue] = useState('');

  // Handle bulk delete
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState<{ open: boolean; documents: ExportDocument[] }>({
    open: false,
    documents: []
  });

  const handleBulkDelete = useCallback((selectedDocuments: ExportDocument[]) => {
    setConfirmDeleteDialog({ open: true, documents: selectedDocuments });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDeleteDialog.documents.length > 0) {
      const idsToDelete = confirmDeleteDialog.documents.map((d) => d.id);
      setDocuments((prev) => prev.filter((d) => !idsToDelete.includes(d.id)));
      setConfirmDeleteDialog({ open: false, documents: [] });
    }
  }, [confirmDeleteDialog.documents]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteDialog({ open: false, documents: [] });
  }, []);

  // Handle single delete
  const [confirmSingleDeleteDialog, setConfirmSingleDeleteDialog] = useState<{ open: boolean; document: ExportDocument | null }>({
    open: false,
    document: null
  });

  const handleDeleteClick = useCallback((document: ExportDocument) => {
    setConfirmSingleDeleteDialog({ open: true, document });
  }, []);

  const handleConfirmSingleDelete = useCallback(() => {
    if (confirmSingleDeleteDialog.document) {
      const documentId = confirmSingleDeleteDialog.document.id;
      setDocuments((prev) => prev.filter((d) => d.id !== documentId));
      setConfirmSingleDeleteDialog({ open: false, document: null });
    }
  }, [confirmSingleDeleteDialog.document]);

  const handleCancelSingleDelete = useCallback(() => {
    setConfirmSingleDeleteDialog({ open: false, document: null });
  }, []);

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useExportDocumentsTable({
    data: documents,
    statusFilter,
    searchValue,
    onDelete: handleDeleteClick,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <ExportDocumentTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="export-documents-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
        onBulkDelete={handleBulkDelete}
      />
      <ExportDocumentTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa ${confirmDeleteDialog.documents.length} chứng từ đã chọn?`}
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
      />

      {/* Confirm Single Delete Dialog */}
      <ConfirmDialog
        open={confirmSingleDeleteDialog.open}
        onClose={handleCancelSingleDelete}
        onConfirm={handleConfirmSingleDelete}
        title="Xác nhận xóa"
        message={
          confirmSingleDeleteDialog.document ? `Bạn có chắc chắn muốn xóa chứng từ ${confirmSingleDeleteDialog.document.documentNo}?` : ''
        }
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          confirmSingleDeleteDialog.document
            ? [
                { label: 'Mã chứng từ', value: confirmSingleDeleteDialog.document.documentNo },
                {
                  label: 'Loại chứng từ',
                  value: confirmSingleDeleteDialog.document.documentType === 'invoice' ? 'Invoice' : 'Packing List'
                },
                { label: 'Khách hàng', value: confirmSingleDeleteDialog.document.customerName || '-' },
                {
                  label: 'Tổng giá trị',
                  value: `${confirmSingleDeleteDialog.document.totalAmount.toLocaleString('vi-VN')} ${confirmSingleDeleteDialog.document.currency}`
                }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default ExportDocumentsListPage;
