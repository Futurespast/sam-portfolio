import { useState } from "react";
import AboutMeAdmin from "./AboutMeAdmin";
import ProjectsAdmin from "./ProjectsAdmin";
import ExperienceAdmin from "./ExperienceAdmin";
import TestimonialsAdmin from "./TestimonialsAdmin";

import "./Responsive.css"; 

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState("About Me");

  const sections = ["About Me", "Projects", "Experience", "Testimonials"];

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-sidebar">
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => setSelectedSection(section)}
            className={
              selectedSection === section
                ? "admin-dashboard-button active"
                : "admin-dashboard-button"
            }
          >
            {section}
          </button>
        ))}
      </div>

      <div className="admin-dashboard-content">
        {selectedSection === "About Me" && <AboutMeAdmin />}
        {selectedSection === "Projects" && <ProjectsAdmin />}
        {selectedSection === "Experience" && <ExperienceAdmin />}
        {selectedSection === "Testimonials" && <TestimonialsAdmin />}
      </div>
    </div>
  );
};

export default AdminDashboard;


