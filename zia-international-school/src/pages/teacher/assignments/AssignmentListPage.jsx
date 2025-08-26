import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AssignmentList from "../../../components/assignments/AssignmentList";

// ✅ Sample assignments data for now
const sampleAssignments = [
  {
    id: "1",
    title: "Math Homework 1",
    gradeName: "Grade 10",
    sectionName: "A",
    subjectName: "Math",
    dueDate: "2025-09-05T17:00",
    status: "PUBLISHED",
  },
  {
    id: "2",
    title: "Science Project",
    gradeName: "Grade 10",
    sectionName: "A",
    subjectName: "Science",
    dueDate: "2025-09-10T17:00",
    status: "DRAFT",
  },
  {
    id: "3",
    title: "English Essay",
    gradeName: "Grade 11",
    sectionName: "B",
    subjectName: "English",
    dueDate: "2025-09-07T17:00",
    status: "PUBLISHED",
  },
];

const AssignmentListPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API fetch with sample data
    setLoading(true);
    try {
      // You can later replace this with actual API call
      setAssignments(sampleAssignments);
    } catch (err) {
      console.error(err);
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = (id) => {
    navigate(`/teacher/dashboard/assignments/edit/${id}`);
  };

  const handleViewStudents = (id) => {
    navigate(`/teacher/dashboard/assignments/${id}/students`);
  };

  const handleDelete = (id) => {
    // Remove assignment from state
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      setAssignments(assignments.filter((a) => a.id !== id));
    }
  };

  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <AssignmentList
      assignments={assignments}
      onEdit={handleEdit}
      onViewStudents={handleViewStudents}
      onDelete={handleDelete}
    />
  );
};

export default AssignmentListPage;
