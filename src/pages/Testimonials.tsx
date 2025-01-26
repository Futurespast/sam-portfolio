import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";

const Testimonials = () => {
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data: testimonialsData, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("approved", true);
      if (error) {
        console.error("Error fetching testimonials:", error);
      } else {
        setTestimonials(testimonialsData || []);
      }
    };

    fetchTestimonials();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !content) {
      setError(language === "EN" ? "Both fields are required." : "Les deux champs sont requis.");
      return;
    }

    const { error } = await supabase.from("testimonials").insert([{ name, content }]);
    if (error) {
      console.error("Error adding testimonial:", error);
      setError(language === "EN" ? "Error adding testimonial." : "Erreur lors de l'ajout du témoignage.");
    } else {
      setFormSubmitted(true);
    }
  };

  return (
    <div style={styles.container}>
      <h1>{language === "EN" ? "Testimonials" : "Témoignages"}</h1>

      {/* Testimonials List */}
      <div style={styles.testimonialsList}>
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <div key={testimonial.id} style={styles.testimonialCard}>
              <h2 style={styles.testimonialName}>{testimonial.name}</h2>
              <p style={styles.testimonialContent}>{testimonial.content}</p>
            </div>
          ))
        ) : (
          <p>{language === "EN" ? "No testimonials yet." : "Pas encore de témoignages."}</p>
        )}
      </div>

      {/* Form or Confirmation Message */}
      {!formSubmitted ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2>{language === "EN" ? "Add a Testimonial" : "Ajoutez un témoignage"}</h2>
          {error && <p style={styles.error}>{error}</p>}
          <input
            type="text"
            placeholder={language === "EN" ? "Your Name" : "Votre Nom"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />
          <textarea
            placeholder={language === "EN" ? "Your Testimonial" : "Votre Témoignage"}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          ></textarea>
          <button type="submit" style={styles.button}>
            {language === "EN" ? "Submit" : "Soumettre"}
          </button>
        </form>
      ) : (
        <p style={styles.confirmation}>
          {language === "EN"
            ? "Testimonial added and awaiting approval."
            : "Témoignage ajouté et en attente d'approbation."}
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    color: "#fff",
    backgroundColor: "#000",
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },
  testimonialsList: {
    marginBottom: "2rem",
  },
  testimonialCard: {
    backgroundColor: "#222",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  testimonialName: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  testimonialContent: {
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
    backgroundColor: "#222",
    padding: "1rem",
    borderRadius: "8px",
  },
  input: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #333",
    outline: "none",
  },
  textarea: {
    padding: "0.8rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #333",
    outline: "none",
    height: "100px",
    resize: "none" as const,
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "0.8rem",
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  confirmation: {
    textAlign: "center" as const,
    fontSize: "1.2rem",
    marginTop: "1rem",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
};

export default Testimonials;
