import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EmployeeForm from './EmployeeForm';
import generatePDF from '../utils/generatePDF'; // Import the PDF function
import './Home.css';

const Home = () => {
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndEmployees = async () => {
            const access = localStorage.getItem('access');
            if (!access) {
                navigate('/login');
                return;
            }
            try {
                const userResponse = await axios.get('http://127.0.0.1:8000/api/user/', {
                    headers: { Authorization: `Bearer ${access}` },
                });
                setUser(userResponse.data);

                const employeesResponse = await axios.get('http://127.0.0.1:8000/api/employees/', {
                    headers: { Authorization: `Bearer ${access}` },
                });
                setEmployees(employeesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                navigate('/login');
            }
        };
        fetchUserAndEmployees();
    }, [navigate]);

    const handleAddEmployee = async (employee) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/employees/', employee, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
            });
            setEmployees([...employees, response.data]);
            setFormVisible(false);
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    const handleUpdateEmployee = async (id, updatedEmployee) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/employees/${id}/`, updatedEmployee, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
            });
            setEmployees(employees.map((emp) => (emp.id === id ? response.data : emp)));
            setFormVisible(false);
            setSelectedEmployee(null);
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access')}` },
            });
            setEmployees(employees.filter((emp) => emp.id !== id));
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => setFormVisible(true)}>Add Employee</button>
            <button onClick={() => generatePDF(employees, user.username)}>Download Employee List</button>
            {isFormVisible && (
                <EmployeeForm
                    onAdd={handleAddEmployee}
                    onCancel={() => setFormVisible(false)}
                    selectedEmployee={selectedEmployee}
                    onUpdate={handleUpdateEmployee}
                />
            )}
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Phone Number</th>
                        <th>Added By</th>
                        <th>Modified By</th>
                        <th>Created On</th>
                        <th>Modified On</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp, index) => (
                        <tr key={emp.id}>
                            <td>{index + 1}</td>
                            <td>{emp.name}</td>
                            <td>{emp.designation}</td>
                            <td>{emp.phone_number}</td>
                            <td>{emp.added_by}</td>
                            <td>{emp.modified_by}</td>
                            <td>{new Date(emp.created_on).toLocaleString()}</td>
                            <td>{new Date(emp.modified_on).toLocaleString()}</td>
                            <td>
                                <button onClick={() => { setSelectedEmployee(emp); setFormVisible(true); }}>Edit</button>
                                <button onClick={() => handleDeleteEmployee(emp.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default Home;
