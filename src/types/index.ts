export interface SchoolData {
  name: string;
  baseTuition: number;
  registrationFee: number;
  applicationFee: number;
  yearlyEnrollmentFee: number;
  lunch: number;
  transport: number;
  uniform: number;
  afterSchool: number;
  url: string;
  feesUrl: string;
  siblingDiscount:
    | {
        second?: number;
        third?: number;
        fourth?: number;
      }
    | number;
  includesLunch: boolean;
  tuitionByGrade: Record<string, number>;
  annualRegistrationByGrade?: {
    primary: number;
    middle: number;
    diploma: number;
  };
  ptaFee?: number;
}

export interface FamilyMember {
  id: number;
  name: string;
  age: number;
  graduationYear: number;
  includeOptionalCosts: {
    lunch: boolean;
    transport: boolean;
    uniform: boolean;
    afterSchool: boolean;
  };
}

export interface FormattedSchoolData {
  name: string;
  baseTuition: number;
  registrationFee: number;
  yearlyEnrollmentFee: number;
  lunch: number;
  transport: number;
  uniform: number;
  afterSchool: number;
  url: string;
  feesUrl: string;
  siblingDiscount: number;
  includesLunch: boolean;
}

export interface YearlyCost {
  mandatory: number;
  optional: number;
  total: number;
  breakdown: {
    baseTuition: number;
    yearlyEnrollmentFee: number;
    lunch: number;
    transport: number;
    uniform: number;
    afterSchool: number;
  };
}

export interface StudentCosts {
  mandatory: Record<string, number>;
  optional: Record<string, number>;
  oneTime: Record<string, number>;
  yearly: Record<string, YearlyCost>;
  totalMandatory: number;
  totalOptional: number;
  totalOneTime: number;
  grandTotal: number;
}

export interface FamilyCosts {
  bySchool: Record<
    string,
    {
      byStudent: Record<number, StudentCosts>;
      totalMandatory: number;
      totalOptional: number;
      totalOneTime: number;
      grandTotal: number;
    }
  >;
}
