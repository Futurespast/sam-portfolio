import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: "", description_eng: "", description_fr: "", link: "" });
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from("projects").select("*");
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  // Add new project
  const addProject = async () => {
    const { data, error } = await supabase.from("projects").insert([newProject]);
    if (error) console.error("Error adding project:", error);
    else setProjects([...projects, data[0]]);
  };

  // Edit existing project
  const editProject = async (id) => {
    await supabase.from("projects").update(editingProject).eq("id", id);
    setProjects((prev) => prev.map((p) => (p.id === id ? editingProject : p)));
    setEditingProject(null);
  };

  // Delete project
  const deleteProject = async (id, imageName) => {
    if (imageName) {
      await supabase.storage.from("storage1").remove([imageName]);
      await supabase.from("projects").update({ image_name: null }).eq("id", id);
    }
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <h2>Manage Projects</h2>

      {/* Add Project */}
      <div>
        <input type="text" placeholder="Title" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
        <input type="text" placeholder="Description (EN)" value={newProject.description_eng} onChange={(e) => setNewProject({ ...newProject, description_eng: e.target.value })} />
        <input type="text" placeholder="Description (FR)" value={newProject.description_fr} onChange={(e) => setNewProject({ ...newProject, description_fr: e.target.value })} />
        <input type="text" placeholder="Link" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} />
        <button onClick={addProject}>Add Project</button>
      </div>

      {/* List of Projects */}
      {projects.map((project) => (
        <div key={project.id}>
          {editingProject?.id === project.id ? (
            <div>
              <input type="text" value={editingProject.title} onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })} />
              <button onClick={() => editProject(project.id)}>Save</button>
            </div>
          ) : (
            <>
              <h3>{project.title}</h3>
              <h3>{project.description_eng}</h3>
              <h3>{project.description_fr}</h3>
              <h3>{project.link}</h3>  
              <button onClick={() => setEditingProject(project)}>Edit</button>
              <button onClick={() => deleteProject(project.id, project.image_name)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsAdmin;
