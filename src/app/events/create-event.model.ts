export interface CreateEventModel {
  scheduledAt: Date,
  workerId: string,
  specialtyId: string,
  referredId: string,
  customerId: string|null,
  observations: string,
}
