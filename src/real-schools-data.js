// Based on the research document for real school data in Portugal

const realSchoolsData = {
  lisboan: {
    name: 'The Lisboan International School',
    baseTuition: 17950, // Average of different grades
    registrationFee: 4750,
    applicationFee: 250,
    yearlyEnrollmentFee: 0, // No yearly re-enrollment fee
    lunch: 1000,
    transport: 3000,
    uniform: 300,
    afterSchool: 500,
    url: 'https://the-lisboan.school',
    feesUrl: 'https://the-lisboan.school/wp-content/uploads/2025/01/schoolfees.pdf',
    siblingDiscount: 0, // No sibling discount
    includesLunch: false,
    tuitionByGrade: {
      // Early Years
      Nursery: 11950,
      Reception: 11950,
      // Primary
      'Year 1': 15950,
      'Year 2': 15950,
      'Year 3': 15950,
      'Year 4': 16950,
      'Year 5': 16950,
      'Year 6': 17950,
      // Middle School
      'Year 7': 17950,
      'Year 8': 17950,
      'Year 9': 19950,
      // High School
      'Year 10': 19950,
      'Year 11': 19950,
      'Year 12': 21950,
      'Year 13': 21950,
    },
  },
  tasis: {
    name: 'TASIS Portugal',
    baseTuition: 19080, // Average of different grades
    registrationFee: 5000, // "Campus Enhancement Fee"
    applicationFee: 100,
    yearlyEnrollmentFee: 750, // Annual re-enrollment fee
    lunch: 0, // Included in tuition
    transport: 3000,
    uniform: 300,
    afterSchool: 0, // Basic activities included
    url: 'https://www.tasisportugal.org/',
    feesUrl: 'https://www.tasisportugal.org/admissions/tuition-fees',
    siblingDiscount: {
      second: 0, // No discount for 2nd child
      third: 15, // 15% discount for 3rd child
      fourth: 25, // 25% discount for 4th child
    },
    includesLunch: true,
    tuitionByGrade: {
      // Elementary
      'Grade 1': 16470,
      'Grade 2': 16470,
      'Grade 3': 18330,
      'Grade 4': 18330,
      'Grade 5': 18330,
      // Middle
      'Grade 6': 19080,
      'Grade 7': 19080,
      'Grade 8': 19080,
      // High School
      'Grade 9': 21990,
      'Grade 10': 21990,
      'Grade 11': 23160,
      'Grade 12': 23160,
    },
  },
  stDominics: {
    name: "Saint Dominic's International School",
    baseTuition: 17100, // Average of different grades
    registrationFee: 5000, // Capital Levy
    applicationFee: 1000,
    yearlyEnrollmentFee: 1500, // Annual registration fee (varies by grade)
    lunch: 1000,
    transport: 3000,
    uniform: 300,
    afterSchool: 500,
    url: 'https://www.dominics-int.org/',
    feesUrl: 'https://www.dominics-int.org/tuition-and-fees-2024-2025/',
    siblingDiscount: {
      second: 5, // 5% discount for 2nd child
      third: 15, // 15% discount for 3rd child
      fourth: 25, // 25% discount for 4th child
    },
    includesLunch: false,
    tuitionByGrade: {
      // Primary
      'Grade 1': 14200,
      'Grade 2': 14400,
      'Grade 3': 14600,
      'Grade 4': 14800,
      'Grade 5': 15000,
      // Middle
      'Grade 6': 17100,
      'Grade 7': 17250,
      'Grade 8': 17400,
      // High School
      'Grade 9': 20500,
      'Grade 10': 20500,
      'Grade 11': 22000,
      'Grade 12': 22000,
    },
    annualRegistrationByGrade: {
      // Primary (Grades 1-5)
      primary: 1200,
      // Middle (Grades 6-10)
      middle: 1500,
      // IB Diploma (Grades 11-12)
      diploma: 2050,
    },
    ptaFee: 35, // Annual PTA fee per family
  },
};

export default realSchoolsData;
