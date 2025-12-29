import { useCallback, useState } from 'react';

import useBoolean from 'hooks/useBoolean';

import type { HarvestOrder } from '../types';

export function useHarvestOrderDelete(onSuccess?: (deletedOrder: HarvestOrder) => void) {
  const confirmDialog = useBoolean(false);
  const [selectedOrder, setSelectedOrder] = useState<HarvestOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(
    (order: HarvestOrder) => {
      setSelectedOrder(order);
      confirmDialog.onTrue();
    },
    [confirmDialog]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedOrder) return;

    setIsDeleting(true);
    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 500)); // Mock delay

      onSuccess?.(selectedOrder);
      alert('Xóa lệnh khai thác thành công! (Mock)');
      confirmDialog.onFalse();
    } catch (error) {
      console.error('Error deleting harvest order:', error);
      alert('Có lỗi xảy ra khi xóa lệnh khai thác');
    } finally {
      setIsDeleting(false);
      setSelectedOrder(null);
    }
  }, [selectedOrder, onSuccess, confirmDialog]);

  const handleCancelDelete = useCallback(() => {
    confirmDialog.onFalse();
    setSelectedOrder(null);
  }, [confirmDialog]);

  return {
    confirmDialog,
    selectedOrder,
    isDeleting,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete
  };
}
