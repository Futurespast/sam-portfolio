import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const Contact = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");

    try {
      const response = await fetch("/.netlify/functions/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setStatusMessage(language === "EN" ? "Email sent successfully!" : "Email envoyé avec succès !");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatusMessage(language === "EN" ? "Error sending email." : "Erreur lors de l'envoi de l'email.");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setStatusMessage(language === "EN" ? "Server error. Try again later." : "Erreur du serveur. Réessayez plus tard.");
    }
  };

  

  return (
    <div style={styles.container}>
      <h1>{language === "EN" ? "Contact Me" : "Contactez Moi"}</h1>
      <p>{language === "EN" ? "Send me a message using the form below." : "Envoyez-moi un message en utilisant le formulaire ci-dessous."}</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="name" placeholder={language === "EN" ? "Your Name" : "Votre Nom"} value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="subject" placeholder={language === "EN" ? "Subject" : "Sujet"} value={formData.subject} onChange={handleChange} required />
        <textarea name="message" placeholder={language === "EN" ? "Your Message" : "Votre Message"} value={formData.message} onChange={handleChange} required></textarea>
        <button type="submit" style={styles.button}>{language === "EN" ? "Send Message" : "Envoyer le Message"}</button>
      </form>

      {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
    </div>
  );
};

const styles = {
  container: { color: "#fff", backgroundColor: "#000", padding: "2rem", textAlign: "center" as const, maxWidth: "600px", margin: "0 auto" },
  form: { display: "flex", flexDirection: "column" as const, gap: "1rem", marginTop: "1rem" },
  button: { backgroundColor: "#007bff", color: "#fff", padding: "0.8rem", border: "none", cursor: "pointer", borderRadius: "5px" },
  statusMessage: { marginTop: "1rem", fontWeight: "bold" as const },
};

export default Contact;

