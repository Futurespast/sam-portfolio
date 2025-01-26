const Footer = () => {
    return (
      <footer style={styles.footer}>
        <div style={styles.links}>
          <a href="https://www.linkedin.com/in/sam-prasad-a00b2432a/" target="_blank" rel="noopener noreferrer" style={styles.link}>
            LinkedIn
          </a>
          <a href="mailto:samprasad7220@gmail.com" style={styles.link}>
            Email
          </a>
          <a href="https://github.com/Futurespast" target="_blank" rel="noopener noreferrer" style={styles.link}>
            GitHub
          </a>
        </div>
        <div style={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} Sam. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  import { CSSProperties } from 'react';
  
  const styles: { [key: string]: CSSProperties } = {
    footer: {
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#000",
      color: "#fff",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem 0",
      boxSizing: "border-box",
    },
    links: {
      display: "flex",
      gap: "1rem",
      marginBottom: "0.5rem",
    },
    link: {
      color: "#fff",
      textDecoration: "none",
      fontWeight: "bold",
    },
    copyright: {
      fontSize: "0.875rem",
    },
  };
  
  
  export default Footer;