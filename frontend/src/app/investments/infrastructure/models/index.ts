export interface InfrastructureProject {
  id: string;
  title: string;
  category: 'commercial' | 'hospitality' | 'healthcare' | 'education';
  description: string;
  location: string;
  landSize: string;
  zoning: string;
  access: string;
  duration: string;
  expectedROI: number; // percentage
  developmentStage: 'planning' | 'construction' | 'completed';
  status: 'active' | 'funded' | 'completed' | 'planning';
  totalProjectValue: number;
  minimumInvestment: number;
  currentInvestors: number;
  targetInvestors: number;
  fundingProgress: number; // percentage
  investmentDeadline: string;
  features: string[];
  image: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface MyInfrastructureInvestment {
  id: string;
  projectId: string;
  title: string;
  category: 'commercial' | 'hospitality' | 'healthcare' | 'education';
  location: string;
  investedAmount: number;
  expectedReturn: number;
  actualReturn: number;
  roi: number;
  payoutSchedule: {
    date: string;
    amount: number;
    status: 'paid' | 'pending';
  }[];
  status: 'active' | 'completed';
  investedDate: string;
  image: string;
}


