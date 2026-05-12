import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IConsultation extends Document {
  userId: mongoose.Types.ObjectId;
  doctorId: string;
  doctorName: string;
  title: string;
  messages: IMessage[];
  stage: number;
  status: 'active' | 'completed';
}

const ConsultationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    title: { type: String, default: 'New Consultation' },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    stage: { type: Number, default: 1 },
    status: { type: String, enum: ['active', 'completed'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model<IConsultation>('Consultation', ConsultationSchema);
