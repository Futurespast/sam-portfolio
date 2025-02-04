import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const ProjectsAdmin = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState<any>({
    title: "",
    description_eng: "",
    description_fr: "",
    link: "",
    image_name: "",
  });
  const [newProjectFile, setNewProjectFile] = useState<File | null>(null);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editProjectFile, setEditProjectFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from("projects").select("*");
      setProjects(data || []);
    };
    fetchProjects();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProjectFile(e.target.files[0]);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditProjectFile(e.target.files[0]);
    }
  };

  // Add new project
  const addProject = async () => {
    let imageName = "";
    if (newProjectFile) {
      const fileName = `${Date.now()}-${newProjectFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("storage1")
        .upload(fileName, newProjectFile);
      if (!uploadError) {
        imageName = fileName;
      }
    }
    const { data, error } = await supabase
      .from("projects")
      .insert([{ ...newProject, image_name: imageName }]);
    if (!error && data) {
      setProjects((prev) => [...prev, data[0]]);
    }
    setNewProject({
      title: "",
      description_eng: "",
      description_fr: "",
      link: "",
      image_name: "",
    });
    setNewProjectFile(null);
  };

  // Edit existing project
  const editProject = async (id: number) => {
    let updatedFields = { ...editingProject };

    // If user uploaded a new file, upload & replace image_name
    if (editProjectFile) {
      const fileName = `${Date.now()}-${editProjectFile.name}`;
      const { error: newUploadError } = await supabase.storage
        .from("storage1")
        .upload(fileName, editProjectFile);
      if (!newUploadError) {
        updatedFields.image_name = fileName;
      }
    }

    await supabase.from("projects").update(updatedFields).eq("id", id);
    setProjects((prev) => prev.map((p) => (p.id === id ? updatedFields : p)));
    setEditingProject(null);
    setEditProjectFile(null);
  };

  // Delete project
  const deleteProject = async (id: number, imageName: string) => {
    if (imageName) {
      await supabase.storage.from("storage1").remove([imageName]);
      await supabase.from("projects").update({ image_name: null }).eq("id", id);
    }
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2>Manage Projects</h2>
      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Title"
          value={newProject.title}
          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description (EN)"
          value={newProject.description_eng}
          onChange={(e) =>
            setNewProject({ ...newProject, description_eng: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description (FR)"
          value={newProject.description_fr}
          onChange={(e) =>
            setNewProject({ ...newProject, description_fr: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Link"
          value={newProject.link}
          onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button style={styles.button} onClick={addProject}>
          Add Project
        </button>
      </form>

      <div style={styles.cardContainer}>
        {projects.map((project) => (
          <div key={project.id} style={styles.card}>
            {project.image_name && (
              <img
                src={`https://<PROJECT_REF>.supabase.co/storage/v1/object/public/storage1/${project.image_name}`}
                alt={project.title}
                style={styles.cardImage}
              />
            )}
            {editingProject?.id === project.id ? (
              <form
                style={styles.form}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                />
                <input
                  type="text"
                  value={editingProject.description_eng}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description_eng: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={editingProject.description_fr}
                  onChange={(e) =>
                    setEditingProject({
                      ...editingProject,
                      description_fr: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  value={editingProject.link}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, link: e.target.value })
                  }
                />
                <input type="file" accept="image/*" onChange={handleEditFileChange} />
                <button style={styles.button} onClick={() => editProject(project.id)}>
                  Save
                </button>
              </form>
            ) : (
              <div style={styles.cardContent}>
                <h3>{project.title}</h3>
                <p>{project.description_eng}</p>
                <p>{project.description_fr}</p>
                <p>
                  <a href={project.link} target="_blank" rel="noreferrer">
                    {project.link}
                  </a>
                </p>
                <button style={styles.button} onClick={() => setEditingProject(project)}>
                  Edit
                </button>
                <button
                  style={styles.button}
                  onClick={() => deleteProject(project.id, project.image_name)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsAdmin;

const styles = {
  container: {
    padding: "1rem",
    color: "#fff",
    backgroundColor: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
    maxWidth: "400px",
    marginBottom: "1rem",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
  },
  card: {
    backgroundColor: "#333",
    padding: "1rem",
    borderRadius: "5px",
    display: "flex",
  },
  cardImage: {
    width: "200px",
    height: "200px",
    borderRadius: "5px",
    marginRight: "1rem",
    objectFit: "cover" as const,
  },
  cardContent: {
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    textAlign: "left" as const,
  },
};