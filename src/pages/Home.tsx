import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";
import "./Responsive.css"
interface Project {
  id: number;
  title: string;
  description_eng: string;
  description_fr: string;
  link?: string;
  image_name: string;
  image_url?: string;
}

interface Experience {
  id: number;
  title: string;
  employer: string;
  start_date: string;
  end_date?: string;
}

const Home = () => {
  const { language } = useLanguage();

 
  const [bio, setBio] = useState({ bioENG: "", bioFR: "" });
  const [profileImage, setProfileImage] = useState("");

 
  const [experience, setExperience] = useState<Experience[]>([]);


  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const projectsPerPage = 2; 

  
  const [cvUrl, setCvUrl] = useState("");

 
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

 
  const visibleProjects = projects.slice(currentProjectIndex, currentProjectIndex + projectsPerPage);

  const handlePrev = () => {
    setCurrentProjectIndex((prev) => Math.max(prev - projectsPerPage, 0));
  };

  const handleNext = () => {
    setCurrentProjectIndex((prev) =>
      prev + projectsPerPage < projects.length ? prev + projectsPerPage : prev
    );
  };


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

 
  useEffect(() => {
    const fetchData = async () => {
   
      const { data: bioData } = await supabase
        .from("text")
        .select("name, content")
        .in("name", ["bioENG", "bioFR"]);
      setBio({
        bioENG: bioData?.find((item) => item.name === "bioENG")?.content || "",
        bioFR: bioData?.find((item) => item.name === "bioFR")?.content || "",
      });

      
      const { data: image } = await supabase.storage.from("storage1").getPublicUrl("sam.jpg");
      setProfileImage(image?.publicUrl || "");

   
      const { data: experienceData } = await supabase
        .from("experience")
        .select("*")
        .order("start_date", { ascending: true });
      setExperience(experienceData || []);

      
      const { data: projectsData } = await supabase.from("projects").select("*");
      const projectsWithImages = (projectsData || []).map((project) => {
        const { data: publicUrlData } = supabase.storage
          .from("storage1")
          .getPublicUrl(project.image_name);
        return {
          ...project,
          image_url: publicUrlData?.publicUrl || null,
        };
      });
      setProjects(projectsWithImages);
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    const fetchCV = async () => {
      
      const fileName = language === "EN" ? "SamPrasadResume.pdf" : "SamPrasadFrenchResume.pdf";
      const { data: cvPublicUrl } = await supabase.storage.from("storage1").getPublicUrl(fileName);
      setCvUrl(cvPublicUrl?.publicUrl || "");
    };
    fetchCV();
  }, [language]);

  return (
    <div className="home-container">
      {/* Terminal Animation */}
      <section className="home-terminal">
        {animatedLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </section>

      {/* About Me */}
      <section className="home-about">
        <h1>{language === "EN" ? "About Me" : "À Propos De Moi"}</h1>
        <img src={profileImage} alt="Sam" className="home-profile-image" />
        <div className="home-text">
          <p>{language === "EN" ? bio.bioENG : bio.bioFR}</p>
        </div>
        {cvUrl && (
          <a
            href={cvUrl}
            download={language === "EN" ? "SamPrasadResume.pdf" : "SamPrasadFrenchResume.pdf"}
            className="home-cv-button"
          >
            {language === "EN" ? "Download My CV" : "Téléchargez Mon CV"}
          </a>
        )}
      </section>

      {/* Experience */}
      <section className="home-experience">
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

      {/* Projects */}
      <section className="home-projects">
        <h1>{language === "EN" ? "Projects" : "Projets"}</h1>
        {projects.length > 0 ? (
          <div className="home-projects-carousel">
            <button
              onClick={handlePrev}
              disabled={currentProjectIndex === 0}
              className="carousel-button"
            >
              &#8592;
            </button>
            <div className="project-card-container">
              {visibleProjects.map((project) => (
                <div key={project.id} className="project-card">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="project-card-image"
                    />
                  )}
                  <div className="project-card-content">
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
            <button
              onClick={handleNext}
              disabled={currentProjectIndex + projectsPerPage >= projects.length}
              className="carousel-button"
            >
              &#8594;
            </button>
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

export default Home;
