import mongoose, { Schema, Document } from 'mongoose';
import { ConsultationReport } from '../types';

export interface IReport extends Document {
  userId: mongoose.Types.ObjectId;
  consultationId: mongoose.Types.ObjectId;
  title: string;
  doctorName: string;
  pdfData?: string; // Base64 or URL
  content: ConsultationReport; // Structured JSON from extraction
}

const ReportSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    consultationId: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
    title: { type: String, required: true },
    doctorName: { type: String, required: true },
    pdfData: String,
    content: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
