import { Schema, model, models, Model, Document, Types } from 'mongoose';

export interface IPrescribedMedication {
  name: string;
  dosage: string;
  instructions: string;
}

export interface IPrescription extends Document {
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  symptoms: string[];
  diagnosis: string;
  medications: IPrescribedMedication[];
  createdAt?: Date;
  updatedAt?:Date;
}

const prescribedMedicationSchema = new Schema<IPrescribedMedication>({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  instructions: { type: String, required: true }
});

const prescriptionSchema = new Schema<IPrescription>({
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  symptoms: { type: [String], required: true },
  diagnosis: { type: String, required: true },
  medications: { type: [prescribedMedicationSchema], required: true },
},{timestamps:true});

export const Prescription: Model<IPrescription> = models.Prescription || model<IPrescription>('Prescription', prescriptionSchema);
