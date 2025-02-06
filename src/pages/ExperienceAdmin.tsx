import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
    const { data, error } = await supabase.from("experience").insert([newExperience]);
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
      setExperience((prev) => prev.map((e) => (e.id === id ? editingExperience : e)));
    }
    setEditingExperience(null);
  };


  const deleteExperience = async (id: number) => {
    await supabase.from("experience").delete().eq("id", id);
    setExperience((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2>Manage Experience</h2>
      <form style={styles.form} onSubmit={(e) => { e.preventDefault(); addExperience(); }}>
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
          onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })}
        />
        <input
          type="text"
          placeholder="End Date"
          value={newExperience.end_date}
          onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })}
        />
        <button style={styles.button} onClick={addExperience}>Add Experience</button>
      </form>

      <div style={styles.cardContainer}>
        {experience.map((exp) => (
          <div key={exp.id ?? Math.random()} style={styles.card}>
            {editingExperience?.id === exp.id ? (
              <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  value={editingExperience?.role || ""}
                  onChange={(e) =>
                    setEditingExperience(editingExperience ? { ...editingExperience, role: e.target.value } : null)
                  }
                />
                <input
                  type="text"
                  value={editingExperience?.employer || ""}
                  onChange={(e) =>
                    setEditingExperience(editingExperience ? { ...editingExperience, employer: e.target.value } : null)
                  }
                />
                <input
                  type="text"
                  value={editingExperience?.start_date || ""}
                  onChange={(e) =>
                    setEditingExperience(editingExperience ? { ...editingExperience, start_date: e.target.value } : null)
                  }
                />
                <input
                  type="text"
                  value={editingExperience?.end_date || ""}
                  onChange={(e) =>
                    setEditingExperience(editingExperience ? { ...editingExperience, end_date: e.target.value } : null)
                  }
                />
                <button style={styles.button} onClick={() => exp.id && editExperienceSave(exp.id)}>
                  Save
                </button>
              </form>
            ) : (
              <div style={styles.cardContent}>
                <h3>
                  {exp.role} at {exp.employer}
                </h3>
                <p>
                  {exp.start_date} - {exp.end_date}
                </p>
                <button style={styles.button} onClick={() => setEditingExperience(exp)}>
                  Edit
                </button>
                <button style={styles.button} onClick={() => exp.id && deleteExperience(exp.id)}>
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
  cardContent: {
    display: "flex",
    flexDirection: "column" as const,
    textAlign: "left" as const,
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
};