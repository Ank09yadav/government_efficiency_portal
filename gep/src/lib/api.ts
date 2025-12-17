
import axios from 'axios';

// Create an Axios instance with base URL
const api = axios.create({
    baseURL: '/api', // Next.js API Routes are at /api
});

// Auth
export const registerUser = async (userData: any) => {
    return await api.post('/auth/register', userData);
};

export const loginUser = async (credentials: any) => {
    return await api.post('/auth/login', credentials);
};

export const loginDepartment = async (credentials: any) => {
    return await api.post('/auth/department/login', credentials);
};

export const loginEmployee = async (credentials: any) => {
    return await api.post('/auth/employee/login', credentials);
};

export const updatePassword = async (data: any) => {
    return await api.put('/auth/change-password', data);
};

export const updateProfile = async (data: any) => {
    return await api.put('/auth/update-profile', data);
};

export const getUserDetails = async (id: string) => {
    const response = await api.get(`/auth/user/${id}`);
    return response.data;
};

export const getCensusStats = async () => {
    const response = await api.get('/auth/census-stats');
    return response.data;
};

// Departments
export const getDepartments = async () => {
    try {
        const response = await api.get('/departments');
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error);
        return [];
    }
};

export const getDepartmentStats = async () => {
    try {
        const response = await api.get('/departments/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching department stats:', error);
        return null;
    }
};

export const updateDepartmentMetrics = async (id: string, metrics: any) => {
    return await api.patch(`/departments/${id}/metrics`, metrics);
};

// Goals
export const getGoals = async () => {
    try {
        const response = await api.get('/goals');
        return response.data;
    } catch (error) {
        console.error('Error fetching goals:', error);
        return [];
    }
};

export const createGoal = async (goalData: any) => {
    return await api.post('/goals', goalData);
};

export const updateGoalProgress = async (id: string, progress: number) => {
    return await api.patch(`/goals/${id}/progress`, { progress });
};

// Teams
export const getTeams = async () => {
    try {
        const response = await api.get('/teams');
        return response.data;
    } catch (error) {
        console.error('Error fetching teams:', error);
        return [];
    }
};

// Employees
export const getEmployees = async () => {
    const response = await api.get('/employees');
    return response.data;
};

export const getPublicEmployees = async (deptId: string) => {
    const response = await api.get(`/employees/public/${deptId}`);
    return response.data;
};

export const getEmployeeGrievances = async (empId: string) => {
    const response = await api.get(`/employees/grievances/${empId}`);
    return response.data;
};

// Grievances
export const createGrievance = async (data: any) => {
    return await api.post('/grievances', data);
};

export const getUserGrievances = async (userId: string) => {
    const response = await api.get(`/grievances/user/${userId}`);
    return response.data;
};

export const getDepartmentGrievances = async (deptId: string) => {
    const response = await api.get(`/grievances/department/${deptId}`);
    return response.data;
};

export const updateGrievanceStatus = async (id: string, status: string, resolutionNotes?: string) => {
    return await api.patch(`/grievances/${id}/status`, { status, resolutionNotes });
};

export const reopenGrievance = async (id: string, userId: string) => {
    return await api.put(`/grievances/${id}/reopen`, { userId });
};

// Schemes
export const getSchemes = async () => {
    const response = await api.get('/schemes');
    return response.data;
};

export const createScheme = async (data: any) => {
    return await api.post('/schemes', data);
};

export default api;
