import AbstractDBModel from './AbstractDBModel'

type AppointmentStatus = 'confirmed' | 'cancelled'
type PaymentStatus = 'paymentConfirmed' | 'paymentPending'
const statusBackgroundColors = {confirmed:'blue', cancelled:'red'}
const statusBorderColors = {paymentConfirmed:'white', paymentPending:'orange'}

export default interface Appointment extends AbstractDBModel {
  startDateTime: string
  endDateTime: string
  patient: string
  location: string
  reason: string
  type: string
  appointmentStatus: string
  paymentStatus: string
}

export type { AppointmentStatus, PaymentStatus }
export { statusBackgroundColors, statusBorderColors }