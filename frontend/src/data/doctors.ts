export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  description: string;
  avatar: string;
  category: string;
}

export const doctors: Doctor[] = [
  {
    id: 'GP_ADA',
    name: 'Dr. Ada Okafor',
    title: 'General Practitioner',
    specialty: 'Everyday symptoms, fevers, infections',
    description: 'Dr. Ada is warm, thorough and focuses on holistic primary care.',
    avatar: '👩‍⚕️',
    category: 'General health',
  },
  {
    id: 'CARDIO_JAMES',
    name: 'Dr. James Reeve',
    title: 'Cardiologist',
    specialty: 'Heart, chest pain, blood pressure',
    description: 'Expert in cardiovascular health and preventative heart care.',
    avatar: '👨‍⚕️',
    category: 'Chest & heart',
  },
  {
    id: 'DERMA_LENA',
    name: 'Dr. Lena Mwangi',
    title: 'Dermatologist',
    specialty: 'Skin, hair, nails, rashes',
    description: 'Specializes in clinical and cosmetic dermatology.',
    avatar: '👩‍⚕️',
    category: 'Skin & hair',
  },
  {
    id: 'OBGYN_AMARA',
    name: 'Dr. Amara Sule',
    title: 'OB/GYN',
    specialty: 'Women\'s health, menstrual health, pregnancy',
    description: 'Dedicated to women\'s reproductive health and wellness.',
    avatar: '👩‍⚕️',
    category: 'Women\'s health',
  },
  {
    id: 'PEDIA_KOFI',
    name: 'Dr. Kofi Mensah',
    title: 'Pediatrician',
    specialty: 'Children\'s health, ages 0–16',
    description: 'Specialist in child development and pediatric medicine.',
    avatar: '👨‍⚕️',
    category: 'Child health',
  },
  {
    id: 'MENTAL_PRIYA',
    name: 'Dr. Priya Nair',
    title: 'Mental Health Counselor',
    specialty: 'Anxiety, depression, stress, sleep',
    description: 'Focuses on therapeutic listening and behavioral health.',
    avatar: '👩‍⚕️',
    category: 'Mental health',
  },
  {
    id: 'NUTRI_YUSUF',
    name: 'Dr. Yusuf Balogun',
    title: 'Nutritionist',
    specialty: 'Diet, weight, gut health, deficiencies',
    description: 'Expert in clinical nutrition and metabolic health.',
    avatar: '👨‍⚕️',
    category: 'Nutrition & diet',
  },
  {
    id: 'ORTHO_SOFIA',
    name: 'Dr. Sofia Andrade',
    title: 'Orthopedist',
    specialty: 'Joints, back pain, muscles, injuries',
    description: 'Specializes in musculoskeletal health and sports medicine.',
    avatar: '👩‍⚕️',
    category: 'Bones & muscles',
  },
];
