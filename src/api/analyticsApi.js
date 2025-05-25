import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Chart colors
export const COLORS = [
  '#0088FE', // Blue
  '#00C49F', // Green
  '#FFBB28', // Yellow
  '#FF8042', // Orange
  '#8884D8', // Purple
  '#82CA9D', // Light Green
  '#FFC658', // Light Yellow
  '#FF6B6B', // Red
  '#4ECDC4', // Turquoise
  '#45B7D1', // Sky Blue
];

// Mock data for development
const mockAnalytics = {
  revenue: [
    { month: 'T1', amount: 5000000 },
    { month: 'T2', amount: 7500000 },
    { month: 'T3', amount: 6000000 },
    { month: 'T4', amount: 9000000 },
    { month: 'T5', amount: 8000000 },
    { month: 'T6', amount: 12000000 },
  ],
  enrollments: [
    { month: 'T1', count: 25 },
    { month: 'T2', count: 35 },
    { month: 'T3', count: 30 },
    { month: 'T4', count: 45 },
    { month: 'T5', count: 40 },
    { month: 'T6', count: 60 },
  ],
  demographics: {
    locations: [
      { name: 'Hà Nội', value: 35 },
      { name: 'TP.HCM', value: 30 },
      { name: 'Đà Nẵng', value: 15 },
      { name: 'Cần Thơ', value: 10 },
      { name: 'Khác', value: 10 },
    ],
    ageGroups: [
      { range: '18-24', count: 40 },
      { range: '25-34', count: 35 },
      { range: '35-44', count: 15 },
      { range: '45+', count: 10 },
    ],
  },
};

export const getCourseAnalytics = async (courseId) => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await axios.get(`${API_URL}/api/analytics/courses/${courseId}`);
    // return response.data;

    // For now, return mock data
    return mockAnalytics;
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    throw error;
  }
};

export const getRevenueAnalytics = async (courseId, period = 'monthly') => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get(`${API_URL}/api/analytics/courses/${courseId}/revenue`, {
    //   params: { period }
    // });
    // return response.data;

    return mockAnalytics.revenue;
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    throw error;
  }
};

export const getEnrollmentAnalytics = async (courseId, period = 'monthly') => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get(`${API_URL}/api/analytics/courses/${courseId}/enrollments`, {
    //   params: { period }
    // });
    // return response.data;

    return mockAnalytics.enrollments;
  } catch (error) {
    console.error('Error fetching enrollment analytics:', error);
    throw error;
  }
};

export const getDemographicsAnalytics = async (courseId) => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get(`${API_URL}/api/analytics/courses/${courseId}/demographics`);
    // return response.data;

    return mockAnalytics.demographics;
  } catch (error) {
    console.error('Error fetching demographics analytics:', error);
    throw error;
  }
};
