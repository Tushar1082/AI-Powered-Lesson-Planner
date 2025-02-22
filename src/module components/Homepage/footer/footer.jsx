import "./footer.css";

export default function Footer() {
    return (
      <footer id="footer">
        <div id='logoDiv_F'>
            <div>
                <img src="logoL.jpeg" alt="error" />
            </div>
            <div>
                <span>AI Powered Lesson Planner</span>
            </div>
        </div>
        <div id="footerContent">
          <p id="footerText">© 2025 AI-Based Lesson Planner. All Rights Reserved.</p>
          <div id="footerLinks">
            <a id="privacyPolicy" href="/privacy">Privacy Policy</a>
            <a id="termsOfService" href="/terms">Terms of Service</a>
            <a id="contactUs" href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
    );
  }
  