import { useState, useCallback, useMemo } from 'react';

// project imports
import ConfirmDialog from 'components/dialogs/confirm-dialog';
import MainCard from 'components/MainCard';

import LegalCertificateTable from '../components/LegalCertificateTable';
import LegalCertificateTableHeader, { type CertificateStatusFilter } from '../components/LegalCertificateTableHeader';
import { useLegalCertificatesTable } from '../hooks/useLegalCertificatesTable';
import { getMockCertificates } from '../mock/certificates';
import type { LegalCertificate } from '../types';
import { calculateCertificateStatus } from '../utils';

// ==============================|| LEGAL CERTIFICATES LIST PAGE ||============================== //

const LegalCertificatesListPage = () => {
  // Get mock data and calculate status for each certificate
  const rawCertificates = getMockCertificates();
  const [certificates, setCertificates] = useState<LegalCertificate[]>(
    rawCertificates.map((cert) => ({
      ...cert,
      status: calculateCertificateStatus(cert.expiryDate)
    }))
  );
  const [isLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<CertificateStatusFilter>('all');

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    certificate: LegalCertificate | null;
  }>({
    open: false,
    certificate: null
  });

  const handleDeleteClick = useCallback((certificate: LegalCertificate) => {
    setConfirmDialog({
      open: true,
      certificate
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (confirmDialog.certificate) {
      const certificateId = confirmDialog.certificate.id;
      setCertificates((prev) => prev.filter((cert) => cert.id !== certificateId));
      setConfirmDialog({ open: false, certificate: null });
    }
  }, [confirmDialog.certificate]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDialog({ open: false, certificate: null });
  }, []);

  // Filter certificates by status
  const filteredCertificates = useMemo(() => {
    if (statusFilter === 'all') return certificates;
    return certificates.filter((cert) => cert.status === statusFilter);
  }, [certificates, statusFilter]);

  // Table setup
  const { table, columnFilters, setColumnFilters, filteredData, csvData, csvHeadersData } = useLegalCertificatesTable({
    data: filteredCertificates,
    searchValue,
    onDelete: handleDeleteClick,
    initialPageSize: 25
  });

  return (
    <MainCard>
      <LegalCertificateTableHeader
        table={table}
        csvData={csvData}
        csvHeadersData={csvHeadersData}
        csvFilename="legal-certificates-export"
        columnFilters={columnFilters}
        onFilterChange={setColumnFilters}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        enableRowSelection
        enableCSVExport
        enableColumnVisibility
      />
      <LegalCertificateTable table={table} data={filteredData} loading={isLoading} />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa chứng chỉ"
        message="Bạn có chắc chắn muốn xóa chứng chỉ này?"
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="error"
        data={
          confirmDialog.certificate
            ? [
                { label: 'Loại chứng chỉ', value: confirmDialog.certificate.certificateType },
                { label: 'Số chứng chỉ', value: confirmDialog.certificate.certificateNumber },
                { label: 'Tổ chức cấp', value: confirmDialog.certificate.issuingOrganization },
                { label: 'Ngày hết hạn', value: new Date(confirmDialog.certificate.expiryDate).toLocaleDateString('vi-VN') }
              ]
            : []
        }
      />
    </MainCard>
  );
};

export default LegalCertificatesListPage;
