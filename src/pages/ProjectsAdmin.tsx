import { useState, useEffect, ChangeEvent, FC } from "react";
import { supabase } from "../lib/supabase";
import "./Responsive.css";

interface Project {
  id: number;
  title: string;
  description_eng: string;
  description_fr: string;
  link: string;
  image_name: string | null;
  image_url?: string | null;
}

interface ProjectInput {
  title: string;
  description_eng: string;
  description_fr: string;
  link: string;
  image_name: string;
}

const ProjectsAdmin: FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<ProjectInput>({
    title: "",
    description_eng: "",
    description_fr: "",
    link: "",
    image_name: "",
  });
  const [newProjectFile, setNewProjectFile] = useState<File | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editProjectFile, setEditProjectFile] = useState<File | null>(null);

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const projectsPerPage = 1;
  const visibleProjects = projects.slice(
    currentProjectIndex,
    currentProjectIndex + projectsPerPage
  );

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: projectsData, error } = await supabase
        .from("projects")
        .select("*");

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      const projectsWithImages = await Promise.all(
        (projectsData || []).map(async (project) => {
          if (project.image_name) {
            const { data: publicUrlData } = supabase.storage
              .from("storage1")
              .getPublicUrl(project.image_name);
            return { ...project, image_url: publicUrlData?.publicUrl || null };
          }
          return { ...project, image_url: null };
        })
      );

      setProjects(projectsWithImages);
    };

    fetchProjects();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProjectFile(e.target.files[0]);
    }
  };

  const handleEditFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditProjectFile(e.target.files[0]);
    }
  };

  const addProject = async () => {
    let imageName = "";
    let imageUrl: string | null = null;

    if (newProjectFile) {
      const fileName = `${Date.now()}-${newProjectFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("storage1")
        .upload(fileName, newProjectFile);
      if (!uploadError) {
        imageName = fileName;
        const { data: publicUrlData } = supabase.storage
          .from("storage1")
          .getPublicUrl(fileName);
        imageUrl = publicUrlData?.publicUrl || null;
      }
    }

    const { data: insertedData, error } = await supabase
      .from("projects")
      .insert([{ ...newProject, image_name: imageName }])
      .select();

    if (!error && insertedData && insertedData.length > 0) {
      setProjects((prev) => [
        ...prev,
        { ...insertedData[0], image_url: imageUrl },
      ]);
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

  const editProject = async (id: number) => {
    if (!editingProject) return;

    // eslint-disable-next-line prefer-const
    let updatedFields = { ...editingProject };
    let newImageUrl: string | null = null;

    if (editProjectFile) {
      const fileName = `${Date.now()}-${editProjectFile.name}`;
      const { error: newUploadError } = await supabase.storage
        .from("storage1")
        .upload(fileName, editProjectFile);
      if (!newUploadError) {
        updatedFields.image_name = fileName;
        const { data: publicUrlData } = await supabase.storage
          .from("storage1")
          .getPublicUrl(fileName);
        newImageUrl = publicUrlData?.publicUrl || null;
      }
    }

    const { error } = await supabase
      .from("projects")
      .update(updatedFields)
      .eq("id", id);
    if (error) {
      console.error("Error updating project:", error);
      return;
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...updatedFields, image_url: newImageUrl || p.image_url }
          : p
      )
    );
    setEditingProject(null);
    setEditProjectFile(null);
  };

  const deleteProject = async (id: number, imageName: string | null) => {
    if (imageName) {
      await supabase.storage.from("storage1").remove([imageName]);
      await supabase.from("projects").update({ image_name: null }).eq("id", id);
    }
    await supabase.from("projects").delete().eq("id", id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePrev = () => {
    setCurrentProjectIndex((prev) => Math.max(prev - projectsPerPage, 0));
  };
  const handleNext = () => {
    setCurrentProjectIndex((prev) =>
      prev + projectsPerPage < projects.length ? prev + projectsPerPage : prev
    );
  };

  return (
    <div className="projects-admin-container">
      <h2>Manage Projects</h2>
      <form className="projects-admin-form" onSubmit={(e) => e.preventDefault()}>
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
        <button className="projects-admin-button" onClick={addProject}>
          Add Project
        </button>
      </form>

      <div className="projects-admin-carousel">
        <button
          className="carousel-arrow-button"
          onClick={handlePrev}
          disabled={currentProjectIndex === 0}
        >
          &#8592;
        </button>
        <div className="projects-card-container">
          {visibleProjects.map((project) => (
            <div key={project.id} className="projects-card">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="projects-card-image"
                />
              )}
              {editingProject?.id === project.id ? (
                <form
                  className="projects-admin-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        title: e.target.value,
                      })
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
                      setEditingProject({
                        ...editingProject,
                        link: e.target.value,
                      })
                    }
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditFileChange}
                  />
                  <button
                    className="projects-admin-button"
                    onClick={() => editProject(project.id)}
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="projects-card-content">
                  <h3>{project.title}</h3>
                  <p>{project.description_eng}</p>
                  <p>{project.description_fr}</p>
                  {project.link && (
                    <p>
                      <a href={project.link} target="_blank" rel="noreferrer">
                        {project.link}
                      </a>
                    </p>
                  )}
                  <button
                    className="projects-admin-button"
                    onClick={() => setEditingProject(project)}
                  >
                    Edit
                  </button>
                  <button
                    className="projects-admin-button"
                    onClick={() => deleteProject(project.id, project.image_name)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className="carousel-arrow-button"
          onClick={handleNext}
          disabled={currentProjectIndex + projectsPerPage >= projects.length}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default ProjectsAdmin;


