import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./Responsive.css"; 

interface Experience {
  id?: number;
  role: string;
  employer: string;
  start_date: string;
  end_date: string;
}

const ExperienceAdmin = () => {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [newExperience, setNewExperience] = useState<Experience>({
    role: "",
    employer: "",
    start_date: "",
    end_date: "",
  });
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      const { data } = await supabase.from("experience").select("*");
      setExperience(data || []);
    };
    fetchExperience();
  }, []);

  const addExperience = async () => {
    const { data, error } = await supabase.from("experience").insert([newExperience]).select();
    if (!error && data) {
      setExperience((prev) => [...prev, data[0]]);
    }
    setNewExperience({
      role: "",
      employer: "",
      start_date: "",
      end_date: "",
    });
  };

  const editExperienceSave = async (id: number) => {
    if (editingExperience) {
      await supabase.from("experience").update(editingExperience).eq("id", id);
      setExperience((prev) =>
        prev.map((e) => (e.id === id ? editingExperience : e))
      );
    }
    setEditingExperience(null);
  };

  const deleteExperience = async (id: number) => {
    await supabase.from("experience").delete().eq("id", id);
    setExperience((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="experience-admin-container">
      <h2>Manage Experience</h2>
      <form
        className="experience-admin-form"
        onSubmit={(e) => {
          e.preventDefault();
          addExperience();
        }}
      >
        <input
          type="text"
          placeholder="Role"
          value={newExperience.role}
          onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
        />
        <input
          type="text"
          placeholder="Employer"
          value={newExperience.employer}
          onChange={(e) => setNewExperience({ ...newExperience, employer: e.target.value })}
        />
        <input
          type="text"
          placeholder="Start Date"
          value={newExperience.start_date}
          onChange={(e) =>
            setNewExperience({ ...newExperience, start_date: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="End Date"
          value={newExperience.end_date}
          onChange={(e) =>
            setNewExperience({ ...newExperience, end_date: e.target.value })
          }
        />
        <button
          type="submit"
          className="experience-admin-button"
        >
          Add Experience
        </button>
      </form>

      <div className="experience-admin-card-container">
        {experience.map((exp) => (
          <div key={exp.id ?? Math.random()} className="experience-admin-card">
            {editingExperience?.id === exp.id ? (
              <form
                className="experience-admin-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  value={editingExperience?.role || ""}
                  onChange={(e) =>
                    setEditingExperience((prev) =>
                      prev ? { ...prev, role: e.target.value } : null
                    )
                  }
                />
                <input
                  type="text"
                  value={editingExperience?.employer || ""}
                  onChange={(e) =>
                    setEditingExperience((prev) =>
                      prev ? { ...prev, employer: e.target.value } : null
                    )
                  }
                />
                <input
                  type="text"
                  value={editingExperience?.start_date || ""}
                  onChange={(e) =>
                    setEditingExperience((prev) =>
                      prev ? { ...prev, start_date: e.target.value } : null
                    )
                  }
                />
                <input
                  type="text"
                  value={editingExperience?.end_date || ""}
                  onChange={(e) =>
                    setEditingExperience((prev) =>
                      prev ? { ...prev, end_date: e.target.value } : null
                    )
                  }
                />
                <button
                  className="experience-admin-button"
                  onClick={() => exp.id && editExperienceSave(exp.id)}
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="experience-admin-card-content">
                <h3>
                  {exp.role} at {exp.employer}
                </h3>
                <p>
                  {exp.start_date} - {exp.end_date}
                </p>
                <button
                  className="experience-admin-button"
                  onClick={() => setEditingExperience(exp)}
                >
                  Edit
                </button>
                <button
                  className="experience-admin-button"
                  onClick={() => exp.id && deleteExperience(exp.id)}
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

export default ExperienceAdmin;
