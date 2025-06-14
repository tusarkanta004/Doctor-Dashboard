import { Schema, model, models, Model, Document } from 'mongoose';

export interface IVitalSigns {
  bloodPressure: string;
  temperature: string;
  pulse: number;
  weight: string;
}

export interface IMedicalHistoryEntry {
  year: number;
  notes: string;
}

export interface IMedication {
  name: string;
  dosage: string;
  instructions: string;
}

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: Date;
  diagnosis: {
    primary: string;
    status: string;
  };
  vitalSigns: IVitalSigns;
  medicalHistory: IMedicalHistoryEntry[];
  medications: IMedication[];
  createdAt?: Date;
  updatedAt?:Date;
}

const vitalSignsSchema = new Schema<IVitalSigns>({
  bloodPressure: { type: String, required: true },
  temperature: { type: String, required: true },
  pulse: { type: Number, required: true },
  weight: { type: String, required: true }
});

const medicalHistoryEntrySchema = new Schema<IMedicalHistoryEntry>({
  year: { type: Number, required: true },
  notes: { type: String, required: true }
});

const medicationSchema = new Schema<IMedication>({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  instructions: { type: String, required: true }
});

const patientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String,enum:["Male","Female","Other"], required: true },
  phone: { type: String, required: true },
  lastVisit: { type: Date, required: true },
  diagnosis: {
    primary: { type: String, required: true },
    status: { type: String, required: true }
  },
  vitalSigns: { type: vitalSignsSchema, required: true },
  medicalHistory: { type: [medicalHistoryEntrySchema], required: true },
  medications: { type: [medicationSchema], required: true },
},{timestamps:true});

export const Patient: Model<IPatient> = models.Patient || model<IPatient>('Patient', patientSchema);
