import mongoose, {Document, Schema,model,models} from "mongoose"
import bcrypt from "bcryptjs"


export interface ICounter extends Document {
  _id: string;
  seq: number;
}



export interface IDoctor extends Document {
    fullName:string;
    firstName:string;
    lastName:string;
    email:string;
    phone:string;
    dateOfBirth:Date;
    gender: "Male" | "Female" | "Other";
    licenseNumber:string;
    experience:number;
    medicalSchool:string;
    graduationYear:number;
    specializations : string [];
    clinicName:string;
    practiceAddress:string;
    city:string;
    state:string;
    zipCode:string;
    consultationFee:number;
    medicalLicenseDocument:string;
    photo?:string;
    bio?:string;
    createdAt?:Date
    updatedAt?:Date
    password:string;
    doctorId:string;
}

const doctorSchema = new Schema<IDoctor>(
    {
        fullName:{
            type:String,
            trim:true,
        },
        firstName:{
            type:String,
            required:true,
            trim:true,
            minlength:[1,"First name must be atleast 1 character long"],
            maxlength:[50,"First name must be less than 50 characters"]
        },
        lastName:{
            type:String,
            required:true,
            trim:true,
            minlength:[1,"Last name must be atleast 1 character long"],
            maxlength:[50,"Last name must be less than 50 characters"]
        },
        email:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            minlength:[8,"Enter valid email that is atleast 8 characters long"]
        },
        phone:{
            type:String,
            required:true,
            unique:true,
            trim:true,
            minlength:[10,"Enter valid phone number"],
            maxlength:[10,"Enter valid phone number"],
        },
        dateOfBirth:{
            type:Date,
            required:true,
        },
        gender:{
            type:String,
            enum:["Male","Female","Other"],
            required:true,
        },
        licenseNumber:{
            type:String,
            required:true,
            trim:true,
            unique:true,
        },
        experience:{
            type:Number,
            default:0,
        },
        medicalSchool:{
            type:String,
            required:true,
            trim:true,
        },
        graduationYear:{
            type:Number,
            required:true,
            min: [1900, 'Year must be after 1900'],
            max: [new Date().getFullYear(), 'Year cannot be in the future'],
        },
        specializations:{
            type:[String],
            enum:['Cardiology','Dermatology', 'Neurology','Pediatrics','Orthopedics','Psychiatry','General Surgery','Internal Medicine'],
            required:true,
        },
        clinicName:{
            type:String,
            required:true,
            trim:true,
        },
        practiceAddress:{
            type:String,
            required:true,
            trim:true,
        },
        city:{
            type:String,
            required:true,
            trim:true,
        },
        state:{
            type:String,
            required:true,
            trim:true,
        },
        zipCode:{
            type:String,
            required:true,
            trim:true,
        },
        consultationFee:{
            type:Number,
            required:true,
            trim:true,
        },
        medicalLicenseDocument:{
            type:String,
            required:true,
        },
        photo:{
            type:String,
        },
        bio:{
            type:String,
        },
        password:{
            type:String,
            required:true,
            trim:true,
            minlength:[6,"Passwod must be atleast 6 characters long"],
        },
        doctorId:{
            type:String,
            unique:true,
        }

    },
    {
        timestamps:true,
    }
)


const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});


doctorSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
    }
    next();
})

doctorSchema.pre('save', function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

doctorSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'doctorId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      if (counter) {
        this.doctorId = `DOC-${counter.seq.toString().padStart(4, '0')}`;
      }
      next();
    } catch (err) {
      next(err as Error);
    }
  } else {
    next();
  }
});

export const Counter = models?.Counter || model<ICounter>('Counter', counterSchema);
const Doctor = models?.Doctor || model<IDoctor>("Doctor",doctorSchema);
export default Doctor