import { useLanguage } from "../context/LanguageContext";

const Contact = () => {
  const { language } = useLanguage();

  const contactLinks = [
    {
      name: language === "EN" ? "Email" : "Courriel",
      url: "mailto:your-email@example.com",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/your-profile",
    },
    {
      name: "GitHub",
      url: "https://github.com/your-github",
    },
  ];

  return (
    <div style={styles.container}>
      <h1>{language === "EN" ? "Contact Me" : "Contactez Moi"}</h1>
      <p>
        {language === "EN"
          ? "Feel free to reach out to me using the links below."
          : "N'hésitez pas à me contacter en utilisant les liens ci-dessous."}
      </p>
      <ul style={styles.linkList}>
        {contactLinks.map((link) => (
          <li key={link.name} style={styles.linkItem}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    color: "#fff",
    backgroundColor: "#000",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center" as const,
  },
  linkList: {
    listStyleType: "none",
    padding: 0,
    marginTop: "1rem",
  },
  linkItem: {
    marginBottom: "1rem",
  },
  link: {
    color: "#007bff",
    fontSize: "1.2rem",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Contact;
