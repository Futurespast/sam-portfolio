import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const ExperienceAdmin = () => {
  const [experience, setExperience] = useState([]);
  const [newExperience, setNewExperience] = useState({ title: "", employer: "", start_date: "", end_date: "" });
  const [editingExperience, setEditingExperience] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      const { data } = await supabase.from("experience").select("*");
      setExperience(data || []);
    };
    fetchExperience();
  }, []);

  // Add experience
  const addExperience = async () => {
    const { data, error } = await supabase.from("experience").insert([newExperience]);
    if (error) console.error("Error adding experience:", error);
    else setExperience([...experience, data[0]]);
  };

  // Edit experience
  const editExperience = async (id) => {
    await supabase.from("experience").update(editingExperience).eq("id", id);
    setExperience((prev) => prev.map((e) => (e.id === id ? editingExperience : e)));
    setEditingExperience(null);
  };

  // Delete experience
  const deleteExperience = async (id) => {
    await supabase.from("experience").delete().eq("id", id);
    setExperience((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      <h2>Manage Experience</h2>

      {/* Add Experience */}
      <div>
        <input type="text" placeholder="Job Title" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} />
        <input type="text" placeholder="Employer" value={newExperience.employer} onChange={(e) => setNewExperience({ ...newExperience, employer: e.target.value })} />
        <input type="date" placeholder="Start Date" value={newExperience.start_date} onChange={(e) => setNewExperience({ ...newExperience, start_date: e.target.value })} />
        <input type="date" placeholder="End Date (optional)" value={newExperience.end_date} onChange={(e) => setNewExperience({ ...newExperience, end_date: e.target.value })} />
        <button onClick={addExperience}>Add Experience</button>
      </div>

      {/* List of Experience */}
      {experience.map((exp) => (
        <div key={exp.id}>
          {editingExperience?.id === exp.id ? (
            <div>
              <input type="text" value={editingExperience.title} onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })} />
              <button onClick={() => editExperience(exp.id)}>Save</button>
            </div>
          ) : (
            <>
              <h3>{exp.title} at {exp.employer}</h3>
              <button onClick={() => setEditingExperience(exp)}>Edit</button>
              <button onClick={() => deleteExperience(exp.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperienceAdmin;
