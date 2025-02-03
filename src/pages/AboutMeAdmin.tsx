import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const AboutMeAdmin = () => {
  const [bioENG, setBioENG] = useState("");
  const [bioFR, setBioFR] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAboutMe = async () => {
      const { data } = await supabase.from("text").select("name, content").in("name", ["bioENG", "bioFR"]);
      if (data) {
        setBioENG(data.find((item) => item.name === "bioENG")?.content || "");
        setBioFR(data.find((item) => item.name === "bioFR")?.content || "");
      }
    };
    fetchAboutMe();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    await supabase
      .from("text")
      .update({ content: bioENG })
      .eq("name", "bioENG");

    await supabase
      .from("text")
      .update({ content: bioFR })
      .eq("name", "bioFR");

    setLoading(false);
  };

  return (
    <div>
      <h2>Edit About Me</h2>
      <textarea value={bioENG} onChange={(e) => setBioENG(e.target.value)} style={styles.textarea} />
      <textarea value={bioFR} onChange={(e) => setBioFR(e.target.value)} style={styles.textarea} />
      <button onClick={handleSave} style={styles.button} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

const styles = {
  textarea: {
    width: "100%",
    height: "100px",
    marginBottom: "1rem",
    padding: "0.5rem",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default AboutMeAdmin;
