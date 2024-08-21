import { PatientModel } from "../patients/patient.model"
import { WorkerModel } from "../workers/worker.model"

export interface GeneralModel {
    _id: string
    bloodPressure: string
    heartFrequency: string
    breathingFrequency: string
    temperature: string
    saturation: string
    weight: string
    diseace: string
    symptoms: string
    story: string
    laboratoryExams: string
    diagnosis: string
    treatment: string
    workPlan: string
    appointmentAt: string
    workerId: string
    patientId: string
    worker: WorkerModel
    patient: PatientModel
    createdAt: string
}