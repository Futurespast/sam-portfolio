import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../context/LanguageContext";
import "./Responsive.css"; 

interface Testimonial {
  id: number;
  name: string;
  content: string;
}

const Testimonials = () => {
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);


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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !content) {
      setError(
        language === "EN" ? "Both fields are required." : "Les deux champs sont requis."
      );
      return;
    }

    const { error } = await supabase.from("testimonials").insert([{ name, content }]);
    if (error) {
      console.error("Error adding testimonial:", error);
      setError(
        language === "EN"
          ? "Error adding testimonial."
          : "Erreur lors de l'ajout du témoignage."
      );
    } else {
      setFormSubmitted(true);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 2, 0));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 2, testimonials.length - 1));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 2);

  return (
    <div className="testimonials-container">
      <h1>{language === "EN" ? "Testimonials" : "Témoignages"}</h1>

      <div className="testimonials-carousel">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="testimonials-nav-button"
        >
          {"<"}
        </button>

        <div className="testimonials-list">
          {visibleTestimonials.length > 0 ? (
            visibleTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <h2 className="testimonial-name">{testimonial.name}</h2>
                <p className="testimonial-content">{testimonial.content}</p>
              </div>
            ))
          ) : (
            <p>
              {language === "EN"
                ? "No testimonials yet."
                : "Pas encore de témoignages."}
            </p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex + 2 >= testimonials.length}
          className="testimonials-nav-button"
        >
          {">"}
        </button>
      </div>

      {!formSubmitted ? (
        <form onSubmit={handleSubmit} className="testimonials-form">
          <h2>
            {language === "EN" ? "Add a Testimonial" : "Ajoutez un témoignage"}
          </h2>
          {error && <p className="testimonials-error">{error}</p>}
          <input
            type="text"
            placeholder={
              language === "EN" ? "Your Name" : "Votre Nom"
            }
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder={
              language === "EN" ? "Your Testimonial" : "Votre Témoignage"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <button type="submit" className="testimonials-submit-button">
            {language === "EN" ? "Submit" : "Soumettre"}
          </button>
        </form>
      ) : (
        <p className="testimonials-confirmation">
          {language === "EN"
            ? "Testimonial added and awaiting approval."
            : "Témoignage ajouté et en attente d'approbation."}
        </p>
      )}
    </div>
  );
};

export default Testimonials;
