// ==============================|| VESSEL TRACKING VALIDATION SCHEMA ||============================== //

import * as yup from 'yup';

import dateHelper from 'utils/dateHelper';

import type { VesselTrackingFormData } from '../types';

/**
 * Validation schema for Vessel Tracking form
 * Using Yup for schema validation
 */
export const vesselTrackingSchema = yup.object<VesselTrackingFormData>().shape({
  shipmentNo: yup.string().required('Mã chuyến là bắt buộc'),

  exportOrderId: yup.string().required('Đơn hàng XK là bắt buộc'),

  vesselName: yup.string().required('Tên tàu là bắt buộc').min(2, 'Tên tàu phải có ít nhất 2 ký tự'),

  voyageNo: yup.string().optional(),

  portOfLoading: yup.string().required('Cảng đi là bắt buộc'),

  portOfDischarge: yup.string().required('Cảng đến là bắt buộc'),

  etd: yup.date().required('Ngày rời cảng là bắt buộc').typeError('Ngày rời cảng không hợp lệ'),

  eta: yup
    .date()
    .required('Ngày đến dự kiến là bắt buộc')
    .typeError('Ngày đến dự kiến không hợp lệ')
    .when('etd', {
      is: (etd: Date | string | undefined) => etd,
      then: (schema) =>
        schema.test('eta-after-etd', 'Ngày đến phải sau ngày rời cảng', function (eta) {
          const { etd } = this.parent;
          if (!eta || !etd) return true;
          const etdDate = dateHelper.normalizeDateValue(etd);
          const etaDate = dateHelper.normalizeDateValue(eta);
          if (!etdDate || !etaDate) return true;
          return etaDate.isAfter(etdDate) || etaDate.isSame(etdDate, 'day');
        })
    }),

  currentStatus: yup.string().oneOf(['running', 'arrived'], 'Trạng thái tàu không hợp lệ').required('Trạng thái tàu là bắt buộc'),

  billOfLading: yup.mixed().optional(),

  trackingMap: yup.string().optional(),

  notes: yup.string().optional()
});

/**
 * Default values for Vessel Tracking form
 */
export const vesselTrackingDefaultValues: VesselTrackingFormData = {
  shipmentNo: '',
  exportOrderId: '',
  vesselName: '',
  voyageNo: '',
  portOfLoading: '',
  portOfDischarge: '',
  etd: dateHelper.formatDate(new Date()),
  eta: dateHelper.formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
  currentStatus: 'running',
  billOfLading: undefined,
  trackingMap: '',
  notes: ''
};
