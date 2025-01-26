import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";

const Home = () => {
  const { language } = useLanguage();

  // State for data
  const [bio, setBio] = useState({ bioENG: "", bioFR: "" });
  const [profileImage, setProfileImage] = useState("");
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [cvUrl, setCvUrl] = useState("");


  // For terminal typing animation
  const [animatedLines, setAnimatedLines] = useState<string[]>([]);
  const terminalText = useMemo(
    () =>
      language === "EN"
        ? [
            "> Run Software Dev -Sam",
            "> Sam starting up...",
            "> Hi! I'm Sam! A Next Gen Software Developer. Scroll down to learn more!",
          ]
        : [
            "> Run Développeur Logiciel -Sam",
            "> Sam démarre...",
            "> Salut! Je suis Sam! Un développeur logiciel de nouvelle génération. Faites défiler pour en savoir plus!",
          ],
    [language]
  );

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    const lines = [...terminalText];
    const tempLines = Array(lines.length).fill("");

    const timer = setInterval(() => {
      if (currentLine < lines.length) {
        tempLines[currentLine] += lines[currentLine][currentChar] || "";
        setAnimatedLines([...tempLines]);
        currentChar++;
        if (currentChar === lines[currentLine].length) {
          currentChar = 0;
          currentLine++;
        }
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [terminalText]);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data: bioData } = await supabase.from("text").select("name, content").in("name", ["bioENG", "bioFR"]);
      setBio({
        bioENG: bioData?.find((item) => item.name === "bioENG")?.content || "",
        bioFR: bioData?.find((item) => item.name === "bioFR")?.content || "",
      });
      const { data: image } = await supabase.storage.from("storage1").getPublicUrl("sam.jpg");
      setProfileImage(image?.publicUrl || "");
      const { data: experienceData } = await supabase.from("experience").select("*").order("start_date", { ascending: true });
      setExperience(experienceData || []);
      const { data: projectsData } = await supabase.from("projects").select("*");
      const projectsWithImages = (projectsData || []).map((project) => {
        const { data: publicUrlData } = supabase.storage.from("storage1").getPublicUrl(project.image_name);
        console.log("Generated Public URL:", project.image_name, publicUrlData?.publicUrl);
        return {
          ...project,
          image_url: publicUrlData?.publicUrl || null, 
        };
      });
      setProjects(projectsWithImages);
      console.log("Projects with Images:", projectsWithImages);
      const { data: cvPublicUrl } = await supabase.storage.from("storage1").getPublicUrl("cv.pdf");
      setCvUrl(cvPublicUrl?.publicUrl || "");
    };
    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <section style={styles.terminal}>
        {animatedLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </section>

      <section style={styles.aboutMe}>
      <h1>{language === "EN" ? "About Me" : "À Propo De Moi"}</h1>
      <img src={profileImage} alt="Sam" style={styles.profileImage} />
      <div style={styles.text}>
        <p>{language === "EN" ? bio.bioENG : bio.bioFR}</p>
      </div>
      {cvUrl && (
        <a href={cvUrl} download="SamPrasadResume.pdf" style={styles.cvButton}>
        {language === "EN" ? "Download My CV" : "Téléchargez Mon CV"}
      </a>
      )}
    </section>

      <section style={styles.experience}>
        <h1>{language === "EN" ? "Experience" : "Expérience"}</h1>
        {experience.length > 0 ? (
          <ul>
            {experience.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong> at {item.employer} (
                {item.start_date} - {item.end_date || "Present"})
              </li>
            ))}
          </ul>
        ) : language === "EN" ? (
          <p>No Professional Experience yet! I'm on the lookout for my first!</p>
        ) : (
          <p>Pas encore d'expérience professionnelle ! Je suis à la recherche de ma première !</p>
        )}
      </section>

      <section style={styles.projects}>
        <h1>{language === "EN" ? "Projects" : "Projets"}</h1>
        {projects.length > 0 ? (
          <div style={styles.cardContainer}>
            {projects.map((project) => (
              <div key={project.id} style={styles.card}>
                <img
                  src={project.image_url}
                  alt={project.title}
                  style={styles.cardImage}
                />
                <div style={styles.cardContent}>
                  <h2>{project.title}</h2>
                  <p>
                    {language === "EN"
                      ? project.description_eng
                      : project.description_fr}
                  </p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      {language === "EN" ? "View Project" : "Voir Projet"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : language === "EN" ? (
          <p>No projects yet but check back soon to see what I make!</p>
        ) : (
          <p>Pas encore de projets mais revenez bientôt pour voir ce que je fais !</p>
        )}
      </section>
    </div>
  );
};

const styles = {
  container: {
    color: "#fff",
    backgroundColor: "#000",
    padding: "1rem",
  },
  terminal: {
    fontFamily: "monospace",
    marginBottom: "2rem",
    fontSize: "1.3rem",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    border: "2px solid #333",
    padding: "1rem",
    borderRadius: "4px",
  },
  aboutMe: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "2rem",
  },
  text: {
    width: "80%",
    marginTop: "1rem",
  },
  profileImage: {
    width: "150px",
    borderRadius: "50%",
  },
  experience: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "2rem",
  },
  projects: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "2rem",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
  },
  card: {
    display: "flex",
    backgroundColor: "#333",
    padding: "1rem",
    borderRadius: "5px",
  },
  cardImage: {
    width: "500px",
    height: "500px",
    borderRadius: "5px",
    marginRight: "1rem",
    objectFit: "cover",
  },
  cardContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "left",
  },

  cvButton: {
    marginTop: "1rem",
    padding: "0.8rem 1.5rem",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    display: "inline-block",
    cursor: "pointer",
  },

};

export default Home;
