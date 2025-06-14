import { Schema, model, models, Model, Document, Types } from 'mongoose';

export interface IClinic extends Document {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  consultationFee: number;
  doctors: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const clinicSchema = new Schema<IClinic>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  phone: { type: String, required: true },
  consultationFee: { type: Number, required: true },
  doctors: [{ type: Schema.Types.ObjectId, ref: 'Doctor' }],
},{timestamps:true});

export const Clinic: Model<IClinic> = models.Clinic || model<IClinic>('Clinic', clinicSchema);
