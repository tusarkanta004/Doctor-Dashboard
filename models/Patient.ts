import { Schema, model, models, Model, Document, Types} from 'mongoose';
//import { Patient } from '@/models/Patient';

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
  bloodGroup:String;
  phone: string;
  email:String;
  address:String;
  lastVisit: Date;
  diagnosis: {
    primary: string;
    status: string;
  };
  vitalSigns: IVitalSigns;
  medicalHistory: IMedicalHistoryEntry[];
  medications: IMedication[];
  allergies:string[];
  doctor: Types.ObjectId;
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
  notes: { type: String, required: true },
  year: { type: Number, required: true },
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
  bloodGroup:{type:String,required:true},
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address:{type:String,required:true},
  lastVisit: { type: Date, required: true },
  diagnosis: {
    primary: { type: String, required: true },
    status: { type: String, required: true }
  },
  allergies:{type:[String],default:null},
  vitalSigns: { type: vitalSignsSchema, required: true },
  medicalHistory: { type: [medicalHistoryEntrySchema], required: true },
  medications: { type: [medicationSchema], required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
},{timestamps:true});

export const Patient: Model<IPatient> = models.Patient || model<IPatient>('Patient', patientSchema);
