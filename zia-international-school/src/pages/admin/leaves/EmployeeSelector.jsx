import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import teacherService from "../../../services/teacherService";
import { Card, Table, Button, Spinner } from "react-bootstrap";

const EmployeeSelector = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await teacherService.getAllTeachers();
        setTeachers(data);
      } catch (err) {
        console.error("Error loading teachers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleAllocateClick = (empId) => {
    navigate(`/admin/dashboard/leaves/allocate/${empId}`);
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="mb-4 text-primary">
          Select Employee to Allocate Leaves
        </h4>
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.empId}>
                  <td>{teacher.empId}</td>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.department}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleAllocateClick(teacher.empId)}
                    >
                      Allocate
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default EmployeeSelector;
