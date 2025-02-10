import React from "react";
import "./Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <div className="footer_section">
        {footerData.map((section, index) => (
          <div className="footer_links" key={index}>
            <div className="footer_links_div">
              <h4>{section.title}</h4>
              {section.links.map((link, i) => (
                <a href={link.url} key={i}>
                  <p>{link.label}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <hr />
      <div className="footer_below_section">
        <div className="copyright_section">
          <p> &copy; 2023-{currentYear} BwraiMart.com, Inc or its Affiliates</p>
        </div>
        <div className="footer_below_links">
          {additionalLinks.map((link, i) => (
            <a href={link.url} key={i}>
              <div>
                <p>{link.label}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

const footerData = [
  {
    title: "KNOW ABOUT US",
    links: [
      { label: "Contact Us", url: "#" },
      { label: "About Us", url: "#" },
      { label: "Careers", url: "#" },
      { label: "Coorporate Information", url: "#" },
    ],
  },
  {
    title: "CONNECT WITH US",
    links: [
      { label: "Facebook", url: "#" },
      { label: "Twitter", url: "#" },
      { label: "Instagram", url: "#" },
      { label: "LinkedIn", url: "#" },
    ],
  },
  {
    title: "EARN MONEY WITH US",
    links: [
      { label: "Sell on BwraiMart", url: "#" },
      { label: "Build Your Business With Us", url: "#" },
      { label: "Affiliate With BwraiMart", url: "#" },
      { label: "Advertise Your Products", url: "#" },
    ],
  },
  {
    title: "HELP",
    links: [
      { label: "About Payments", url: "#" },
      { label: "Shipping", url: "#" },
      { label: "FAQ", url: "#" },
      { label: "Return Policies", url: "#" },
    ],
  },
];
const additionalLinks = [
  { label: "Terms & Conditions", url: "#" },
  { label: "Privacy & Policy", url: "#" },
  { label: "Security", url: "#" },
];

// import React, { useEffect } from "react";
// import appleStore from "../../../images/apple_store_badge.png";
// import playStore from "../../../images/google_play_badge.png";
// import "./Footer.css";
// import googleFonts from "google-fonts";

// function Footer() {
//   useEffect(() => {
//     // Add Google Fonts dynamically
//     googleFonts.add({
//       Roboto: ["400", "700"],
//     });
//   }, []);
//   return (
//     <footer id="footer">
//       {/* Left Footer */}
//       <div className="left-footer">
//         <h4>Download our App</h4>
//         <img src={appleStore} alt="" />
//         <img src={playStore} alt="" />
//       </div>

//       {/* Mid Footer */}
//       <div className="mid-footer">
//         <h1>E-Commerce</h1>
//         <p>High quality is our first priority</p>
//         <p>Copyright &copy; Bwrai</p>
//       </div>

//       {/* Right Footer */}
//       <div className="right-footer">
//         <h4>Follow us</h4>
//         <a href="">Instagram</a>
//         <a href="">FaceBook</a>
//         <a href="">Youtube</a>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
