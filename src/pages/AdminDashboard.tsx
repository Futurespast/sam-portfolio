import { useState } from "react";
import AboutMeAdmin from "./AboutMeAdmin";
import ProjectsAdmin from "./ProjectsAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import TestimonialsAdmin from "./TestimonialsAdmin";

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("About Me");

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        {["About Me", "Projects", "Experience", "Testimonials"].map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            style={selectedSection === section ? styles.activeButton : styles.button}
          >
            {section}
          </button>
        ))}
      </div>

      <div style={styles.content}>
        {selectedSection === "About Me" && <AboutMeAdmin />}
        {selectedSection === "Projects" && <ProjectsAdmin />}
        {selectedSection === "Experience" && <ExperienceAdmin />}
        {selectedSection === "Testimonials" && <TestimonialsAdmin />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#000",
    color: "#fff",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#222",
    padding: "1rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  activeButton: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  content: {
    flex: 1,
    padding: "2rem",
  },
};

export default AdminDashboard;

