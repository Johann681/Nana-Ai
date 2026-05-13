import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { generateTokens, setTokenCookies, clearTokenCookies } from '../utils/auth';
import { AuthRequest } from '../types';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      onboardingComplete: user.onboardingComplete,
      accessToken,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id.toString());
      setTokenCookies(res, accessToken, refreshToken);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
        accessToken,
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};

export const logout = (req: Request, res: Response) => {
  clearTokenCookies(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'superrefreshsecret') as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: 'Token refreshed', accessToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
        profile: user.profile,
        healthInfo: user.healthInfo,
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { profile, healthInfo, onboardingComplete } = req.body;

    // Safely update profile
    if (profile) {
      user.profile = {
        ...user.profile,
        ...profile,
        emergencyContact: {
          ...(user.profile?.emergencyContact || {}),
          ...(profile.emergencyContact || {}),
        }
      };
    }

    // Safely update healthInfo
    if (healthInfo) {
      user.healthInfo = {
        ...user.healthInfo,
        ...healthInfo,
      };
    }

    if (onboardingComplete !== undefined) {
      user.onboardingComplete = onboardingComplete;
    }

    await user.save();
    
    console.log('[Profile Update] Success for user:', user._id);
    
    res.json({ 
      message: 'Profile updated successfully', 
      user: {
        _id: user._id,
        onboardingComplete: user.onboardingComplete,
        profile: user.profile,
        healthInfo: user.healthInfo
      }
    });
  } catch (error: unknown) {
    console.error('[Profile Update] Error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: message });
  }
};
