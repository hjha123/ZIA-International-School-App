import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import leaveService from "../../../services/leaveService";
import teacherService from "../../../services/teacherService";

const LeaveAllocation = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 10;

  const [selectedType, setSelectedType] = useState("");
  const [leaveDays, setLeaveDays] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [applyToAll, setApplyToAll] = useState(true);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadLeaveTypes();
    loadTeachers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, teachers]);

  const loadLeaveTypes = async () => {
    try {
      const data = await leaveService.getAllLeaveTypes();
      setLeaveTypes(data);
    } catch (err) {
      setErrorMsg("⚠️ Failed to load leave types.");
    }
  };

  const loadTeachers = async () => {
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
      setFilteredTeachers(data);
    } catch (err) {
      setErrorMsg("⚠️ Failed to load teachers.");
    }
  };

  const handleSearch = () => {
    const filtered = teachers.filter(
      (t) =>
        t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.empId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTeachers(filtered);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (
      !selectedType ||
      !leaveDays ||
      (!applyToAll && selectedTeachers.length === 0)
    ) {
      setErrorMsg("Please fill all required fields.");
      return;
    }

    const currentYear = new Date().getFullYear();

    const payload = {
      leaveType: selectedType,
      totalAllocated: parseInt(leaveDays, 10),
      empIds: applyToAll ? teachers.map((t) => t.empId) : selectedTeachers,
      year: currentYear,
    };

    try {
      setLoading(true);
      await leaveService.allocateLeaves(payload);
      setSuccessMsg(`✅ Leave allocated successfully for year ${currentYear}.`);
      setLeaveDays("");
      setSelectedTeachers([]);
    } catch (err) {
      setErrorMsg("❌ Failed to allocate leave.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLast = currentPage * teachersPerPage;
  const indexOfFirst = indexOfLast - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  return (
    <Card className="shadow-lg border-0 rounded-3 p-4 bg-light">
      <h3 className="mb-4 text-primary fw-bold border-bottom pb-2">
        Leave Allocation
      </h3>

      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form onSubmit={handleSubmit}>
        {/* Allocation Options */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Leave Type</Form.Label>
              <Form.Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                required
              >
                <option value="">-- Select Leave Type --</option>
                {leaveTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Number of Days</Form.Label>
              <Form.Control
                type="number"
                value={leaveDays}
                onChange={(e) => setLeaveDays(e.target.value)}
                required
                min={1}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Apply to all toggle */}
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="applyToAllSwitch"
            label="Apply to all teachers"
            checked={applyToAll}
            onChange={() => setApplyToAll(!applyToAll)}
            className="fw-semibold"
          />
        </Form.Group>

        {/* Teacher Selection */}
        {!applyToAll && (
          <Card className="p-3 shadow-sm mb-4">
            <h6 className="fw-bold mb-3 text-secondary">Select Teachers</h6>

            <InputGroup className="mb-3">
              <Form.Control
                placeholder="🔍 Search by name or empId..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <Form.Select
              multiple
              value={selectedTeachers}
              onChange={(e) =>
                setSelectedTeachers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              style={{ height: "200px", fontSize: "0.9rem" }}
            >
              {currentTeachers.map((teacher) => (
                <option key={teacher.empId} value={teacher.empId}>
                  {teacher.fullName} ({teacher.empId})
                </option>
              ))}
            </Form.Select>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  ⬅ Previous
                </Button>
                <span className="fw-semibold small text-muted">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next ➡
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* Submit */}
        <div className="text-end">
          <Button type="submit" variant="success" size="lg" disabled={loading}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "🚀 Allocate Leave"
            )}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default LeaveAllocation;
