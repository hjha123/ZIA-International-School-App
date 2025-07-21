import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Spinner,
  Row,
  Col,
  Alert,
  Tab,
  Tabs,
  Card,
  Modal,
} from "react-bootstrap";
import teacherService from "../../../services/teacherService";

const TeacherUpdate = () => {
  const { empId } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [key, setKey] = useState("system");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subjectIds: [],
    gender: "",
    dateOfBirth: "",
    qualification: "",
    address: "",
    joiningDate: "",
    experienceYears: 0,
    maritalStatus: "",
    emergencyContactInfo: "",
    bloodGroup: "",
    nationality: "",
    aadharNumber: "",
    profileImageUrl: "",
    teacherType: "",
    gradeName: "",
    sectionName: "",
    empId: "",
    username: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherData, subjectList, gradeList] = await Promise.all([
          teacherService.getTeacherByEmpId(empId),
          teacherService.getAllSubjects(),
          teacherService.getAllGrades(),
        ]);

        setTeacher(teacherData);
        setSubjects(subjectList || []);
        setGrades(gradeList || []);

        setForm({
          fullName: teacherData.fullName || "",
          email: teacherData.email || "",
          phone: teacherData.phone || "",
          subjectIds:
            teacherData.subjects
              ?.map((name) => {
                const matched = subjectList.find((subj) => subj.name === name);
                return matched ? matched.id : null;
              })
              .filter((id) => id !== null) || [],
          gender: teacherData.gender || "",
          dateOfBirth: teacherData.dateOfBirth || "",
          qualification: teacherData.qualification || "",
          address: teacherData.address || "",
          joiningDate: teacherData.joiningDate || "",
          experienceYears: teacherData.experienceYears || 0,
          maritalStatus: teacherData.maritalStatus || "",
          emergencyContactInfo: teacherData.emergencyContactInfo || "",
          bloodGroup: teacherData.bloodGroup || "",
          nationality: teacherData.nationality || "",
          aadharNumber: teacherData.aadharNumber || "",
          profileImageUrl: teacherData.profileImageUrl || "",
          teacherType: teacherData.teacherType || "",
          gradeName: teacherData.gradeName || "",
          sectionName: teacherData.sectionName || "",
          empId: teacherData.empId || "",
          username: teacherData.username || "",
        });

        if (teacherData.gradeName) {
          const selectedGrade = gradeList.find(
            (g) => g.name === teacherData.gradeName
          );
          if (selectedGrade) {
            const fetchedSections = await teacherService.getSectionsByGrade(
              selectedGrade.id
            );
            setSections(fetchedSections || []);
          } else {
            setSections([]);
          }
        }
      } catch (err) {
        console.error("Error fetching teacher data:", err);
        setError("Failed to load teacher data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [empId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) =>
      parseInt(opt.value)
    );
    setForm((prev) => ({ ...prev, subjectIds: selectedOptions }));
  };

  const handleGradeChange = async (e) => {
    const gradeName = e.target.value;
    setForm((prev) => ({ ...prev, gradeName, sectionName: "" }));

    const selectedGrade = grades.find((g) => g.name === gradeName);
    if (selectedGrade) {
      const sectionList = await teacherService.getSectionsByGrade(
        selectedGrade.id
      );
      setSections(sectionList || []);
    } else {
      setSections([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.subjectIds || form.subjectIds.length === 0) {
      setError("Please select at least one subject.");
      return;
    }

    try {
      await teacherService.updateTeacherByEmpId(empId, form);
      setShowSuccessModal(true); // ✅ show modal
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update teacher. Please check the input.");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/admin/dashboard/teachers");
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="container mt-4">
      <h2 className="text-primary fw-bold mb-4">
        <i className="bi bi-pencil-square me-2"></i>
        Update Teacher: <span className="text-success">{form.fullName}</span>
      </h2>

      <Form onSubmit={handleSubmit}>
        <Tabs
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3 bg-light rounded"
          justify
        >
          <Tab eventKey="system" title="System Info">
            <Card className="p-4 bg-light border-info">
              <Row>
                <Col md={6}>
                  <Form.Group controlId="empId" className="mb-3">
                    <Form.Label>Employee ID</Form.Label>
                    <Form.Control type="text" value={form.empId} disabled />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="username" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" value={form.username} disabled />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="personal" title="Personal Information">
            <Card className="p-4 bg-light border-secondary">
              <Row>
                <Col md={6}>
                  <Form.Group controlId="fullName" className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="email" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={form.email}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group controlId="phone" className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="gender" className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="dateOfBirth" className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="qualification" className="mb-3">
                    <Form.Label>Qualification</Form.Label>
                    <Form.Control
                      type="text"
                      name="qualification"
                      value={form.qualification}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="address" className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="professional" title="Professional Details">
            <Card className="p-4 bg-light border-warning">
              <Row>
                <Col md={6}>
                  <Form.Group controlId="joiningDate" className="mb-3">
                    <Form.Label>Joining Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="joiningDate"
                      value={form.joiningDate}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="experienceYears" className="mb-3">
                    <Form.Label>Experience (Years)</Form.Label>
                    <Form.Control
                      type="number"
                      name="experienceYears"
                      value={form.experienceYears}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="gradeName" className="mb-3">
                    <Form.Label>Grade</Form.Label>
                    <Form.Select
                      name="gradeName"
                      value={form.gradeName}
                      onChange={handleGradeChange}
                    >
                      <option value="">Select Grade</option>
                      {grades.map((g) => (
                        <option key={g.id} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="sectionName" className="mb-3">
                    <Form.Label>Section</Form.Label>
                    <Form.Select
                      name="sectionName"
                      value={form.sectionName}
                      onChange={handleChange}
                    >
                      <option value="">Select Section</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="subjectIds" className="mb-3">
                    <Form.Label>
                      Subjects <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      multiple
                      name="subjectIds"
                      value={form.subjectIds}
                      onChange={handleSubjectsChange}
                      required
                      isInvalid={form.subjectIds.length === 0}
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Please select at least one subject.
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="teacherType" className="mb-3">
                    <Form.Label>Teacher Type</Form.Label>
                    <Form.Select
                      name="teacherType"
                      value={form.teacherType}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="FULL_TIME">FULL_TIME</option>
                      <option value="PART_TIME">PART_TIME</option>
                      <option value="GUEST">GUEST</option>
                      <option value="VISITING">VISITING</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          </Tab>

          <Tab eventKey="optional" title="Optional Details">
            <Card className="p-4 bg-light border-success">
              <Row>
                <Col md={6}>
                  <Form.Group controlId="maritalStatus" className="mb-3">
                    <Form.Label>Marital Status</Form.Label>
                    <Form.Select
                      name="maritalStatus"
                      value={form.maritalStatus}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="emergencyContactInfo" className="mb-3">
                    <Form.Label>Emergency Contact Info</Form.Label>
                    <Form.Control
                      type="text"
                      name="emergencyContactInfo"
                      value={form.emergencyContactInfo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="bloodGroup" className="mb-3">
                    <Form.Label>Blood Group</Form.Label>
                    <Form.Control
                      type="text"
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="nationality" className="mb-3">
                    <Form.Label>Nationality</Form.Label>
                    <Form.Control
                      type="text"
                      name="nationality"
                      value={form.nationality}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="aadharNumber" className="mb-3">
                    <Form.Label>Aadhar Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="aadharNumber"
                      value={form.aadharNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="profileImageUrl" className="mb-3">
                    <Form.Label>Profile Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="profileImageUrl"
                      value={form.profileImageUrl}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card>
          </Tab>
        </Tabs>

        <div className="d-flex justify-content-end mt-4 gap-2">
          <Button
            variant="secondary"
            className="px-4"
            onClick={() => navigate("/admin/dashboard/teachers")}
          >
            Cancel
          </Button>
          <Button variant="success" type="submit" className="px-4">
            Update Teacher
          </Button>
        </div>
      </Form>
      <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>
            <i className="bi bi-check-circle-fill me-2"></i>Update Successful
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h5 className="text-success mb-3">
            Teacher details have been updated successfully!
          </h5>
          <i className="bi bi-person-badge display-4 text-success"></i>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Go to Teacher List
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeacherUpdate;
