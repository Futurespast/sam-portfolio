import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./Responsive.css";

const AboutMeAdmin = () => {
  const [bioENG, setBioENG] = useState("");
  const [bioFR, setBioFR] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAboutMe = async () => {
      const { data } = await supabase
        .from("text")
        .select("name, content")
        .in("name", ["bioENG", "bioFR"]);

      if (data) {
        setBioENG(data.find((item) => item.name === "bioENG")?.content || "");
        setBioFR(data.find((item) => item.name === "bioFR")?.content || "");
      }
    };
    fetchAboutMe();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    await supabase.from("text").update({ content: bioENG }).eq("name", "bioENG");
    await supabase.from("text").update({ content: bioFR }).eq("name", "bioFR");

    setLoading(false);
  };

  return (
    <div className="aboutme-admin-container">
      <h2 className="aboutme-admin-title">Edit About Me</h2>
      <textarea
        className="aboutme-admin-textarea"
        value={bioENG}
        onChange={(e) => setBioENG(e.target.value)}
      />
      <textarea
        className="aboutme-admin-textarea"
        value={bioFR}
        onChange={(e) => setBioFR(e.target.value)}
      />
      <button
        className="aboutme-admin-button"
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default AboutMeAdmin;

