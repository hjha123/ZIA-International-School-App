import React, { useState } from "react";
import { Table, Form, Button } from "react-bootstrap";

const AdminAssignmentListPage = () => {
  const [filter, setFilter] = useState({
    grade: "",
    section: "",
    teacher: "",
    search: "",
  });

  // Mock data for now
  const assignments = [
    {
      id: 1,
      title: "Algebra Homework",
      teacher: "Mr. Sharma",
      grade: "Grade 10",
      section: "A",
      subject: "Math",
      dueDate: "2025-09-01",
      status: "Published",
    },
    {
      id: 2,
      title: "Science Project",
      teacher: "Ms. Gupta",
      grade: "Grade 9",
      section: "B",
      subject: "Science",
      dueDate: "2025-09-05",
      status: "Draft",
    },
  ];

  const filteredAssignments = assignments.filter((a) => {
    return (
      (filter.grade === "" || a.grade === filter.grade) &&
      (filter.section === "" || a.section === filter.section) &&
      (filter.teacher === "" || a.teacher === filter.teacher) &&
      (filter.search === "" ||
        a.title.toLowerCase().includes(filter.search.toLowerCase()))
    );
  });

  return (
    <div className="container mt-3">
      <h3>All Assignments (Admin View)</h3>

      {/* Filters */}
      <div className="d-flex mb-3 gap-2">
        <Form.Select
          value={filter.grade}
          onChange={(e) => setFilter({ ...filter, grade: e.target.value })}
        >
          <option value="">All Grades</option>
          <option>Grade 9</option>
          <option>Grade 10</option>
        </Form.Select>

        <Form.Select
          value={filter.section}
          onChange={(e) => setFilter({ ...filter, section: e.target.value })}
        >
          <option value="">All Sections</option>
          <option>A</option>
          <option>B</option>
        </Form.Select>

        <Form.Select
          value={filter.teacher}
          onChange={(e) => setFilter({ ...filter, teacher: e.target.value })}
        >
          <option value="">All Teachers</option>
          <option>Mr. Sharma</option>
          <option>Ms. Gupta</option>
        </Form.Select>

        <Form.Control
          type="text"
          placeholder="Search by title..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
      </div>

      {/* Assignment Table */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Teacher</th>
            <th>Grade</th>
            <th>Section</th>
            <th>Subject</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssignments.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.teacher}</td>
              <td>{a.grade}</td>
              <td>{a.section}</td>
              <td>{a.subject}</td>
              <td>{a.dueDate}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminAssignmentListPage;
