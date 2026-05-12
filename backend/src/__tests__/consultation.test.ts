import { createConsultation } from '../controllers/consultationController';
import Consultation from '../models/Consultation';
import { Response } from 'express';
import { AuthRequest } from '../types';

jest.mock('../models/Consultation');

describe('Consultation Controller - Create', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockRequest = {
      user: { id: 'user123' } as any,
      body: {
        doctorId: 'GP_ADA',
        doctorName: 'Dr. Ada Okafor',
      },
    } as any;
    mockResponse = {
      status: statusMock,
    };
  });

  it('should create a new consultation successfully', async () => {
    const mockConsultation = {
      _id: 'consult123',
      userId: 'user123',
      doctorId: 'GP_ADA',
      doctorName: 'Dr. Ada Okafor',
      status: 'active',
      stage: 1,
      messages: [],
    };
    (Consultation.create as jest.Mock).mockResolvedValue(mockConsultation);

    await createConsultation(mockRequest as AuthRequest, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(mockConsultation);
  });
});
