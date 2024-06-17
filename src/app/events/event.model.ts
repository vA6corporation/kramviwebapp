import { CustomerModel } from "../customers/customer.model";
import { UserModel } from "../users/user.model";
import { WorkerModel } from "../workers/worker.model";
import { EventItemModel } from "./event-item.model";
import { SpecialtyModel } from "./specialty.model";

export interface EventModel {
  _id: string
  saleId: string
  scheduledAt: string
  customer: CustomerModel
  worker: WorkerModel
  referred: WorkerModel
  specialty: SpecialtyModel
  user: UserModel
  workerId: string
  referredId: string
  specialtyId: string
  eventItems: EventItemModel[]
  observations: string
  createdAt: string
}