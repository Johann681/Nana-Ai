import { Response } from 'express';
import Consultation from '../models/Consultation';
import { AuthRequest } from '../types';
import { AIPipeline } from '../ai/aiPipeline';

export const createConsultation = async (req: AuthRequest, res: Response) => {
  const { doctorId, doctorName } = req.body;
  try {
    const consultation = await Consultation.create({
      userId: req.user?._id,
      doctorId,
      doctorName,
      messages: [],
    });
    res.status(201).json(consultation);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const { consultationId } = req.params;
  const { content } = req.body;

  try {
    const consultation = await Consultation.findById(consultationId);
    if (!consultation) return res.status(404).json({ error: 'Consultation not found' });

    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // 1. Process through AI Pipeline
    const history = consultation.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    const result = await AIPipeline.processMessage(content, user, history);

    // 2. Update Database
    consultation.messages.push({ role: 'user', content, timestamp: new Date() });
    consultation.messages.push({ role: 'assistant', content: result.aiResponse, timestamp: new Date() });
    
    if (result.isEmergency) {
      consultation.status = 'completed';
    } else if (result.suggestedStageIncrease && consultation.stage < 4) {
      consultation.stage += 1;
    }
    
    await consultation.save();

    // 3. Respond
    res.json({ 
      chunks: [result.aiResponse], 
      stage: consultation.stage,
      specialist: result.specialist,
      isEmergency: result.isEmergency
    });
  } catch (error: unknown) {
    console.error('[AI Error]', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};

export const getConsultations = async (req: AuthRequest, res: Response) => {
  try {
    const consultations = await Consultation.find({ userId: req.user?._id }).sort({ createdAt: -1 });
    res.json(consultations);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};

export const getConsultation = async (req: AuthRequest, res: Response) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation || consultation.userId.toString() !== req.user?._id?.toString()) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    res.json(consultation);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};
