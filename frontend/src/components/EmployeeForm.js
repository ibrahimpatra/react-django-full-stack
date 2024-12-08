import React, { useState } from 'react';

const EmployeeForm = ({ onAdd, onCancel, selectedEmployee, onUpdate }) => {
    const [name, setName] = useState(selectedEmployee?.name || '');
    const [designation, setDesignation] = useState(selectedEmployee?.designation || '');
    const [phoneNumber, setPhoneNumber] = useState(selectedEmployee?.phone_number || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const employeeData = { name, designation, phone_number: phoneNumber };
        if (selectedEmployee) {
            onUpdate(selectedEmployee.id, employeeData);
        } else {
            onAdd(employeeData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Designation:</label>
                <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Phone Number:</label>
                <input
                    type="number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{selectedEmployee ? 'Update' : 'Add'}</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default EmployeeForm;
