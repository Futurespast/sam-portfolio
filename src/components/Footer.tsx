import "../pages/Responsive.css";
const Footer = () => {
    return (
      <footer className="footer">
      <div className="footer-links">
          <a href="https://www.linkedin.com/in/sam-prasad-a00b2432a/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href="mailto:samprasad7220@gmail.com">
            Email
          </a>
          <a href="https://github.com/Futurespast" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
          <p>&copy; {new Date().getFullYear()} Sam. All rights reserved.</p>
      </footer>
    );
  };
  
  export default Footer;