import React from "react";

export default function FooterPanel() {
  return (
    <div className="footer">
      <div className="footer_section">
        <div className="footer_links">
          {/* About Us Section */}
          <div className="footer_links_div">
            <h4>KNOW ABOUT US</h4>
            <a href="">
              <p>Contact Us</p>
            </a>
            <a href="">
              <p>About Us</p>
            </a>
            <a href="">
              <p>Careers</p>
            </a>
            <a href="">
              <p>Coorporate Information</p>
            </a>
          </div>
          {/* Connect with Us Section */}
          <div className="footer_links_div">
            <h4>CONNECT WITH US</h4>
            <a href="">
              <p>Facebook</p>
            </a>
            <a href="">
              <p>Twitter</p>
            </a>
            <a href="">
              <p>Instagram</p>
            </a>
            <a href="">
              <p>LinkedIn</p>
            </a>
          </div>
          {/* Earn with Us Section */}
          <div className="footer_links_div">
            <h4>EARN MONEY WITH US</h4>
            <a href="">
              <p>Sell on BwraiMart</p>
            </a>
            <a href="">
              <p>Build Your Business With Us</p>
            </a>
            <a href="">
              <p>Affiliate With BwraiMart</p>
            </a>
            <a href="">
              <p>Advertise Your Products</p>
            </a>
          </div>
          {/* Help Section */}
          <div className="footer_links_div">
            <h4>HELP</h4>
            <a href="">
              <p>About Payments</p>
            </a>
            <a href="">
              <p>Shipping</p>
            </a>
            <a href="">
              <p>FAQ</p>
            </a>
            <a href="">
              <p>Return Policies</p>
            </a>
          </div>
          {/* End of section */}
        </div>
        <hr />
        <div className="footer_below_section">
          <div className="copyright_section">
            <p>
              2023 - @{new Date().getFullYear()} BwraiMart.com, Inc or its
              affiliates
            </p>
          </div>
          <div className="footer_below_links">
            <a href="">
              <div>
                <p>Terms & Conditions</p>
              </div>
            </a>
            <a href="">
              <div>
                <p>Privacy & Policy</p>
              </div>
            </a>
            <a href="">
              <div>
                <p>Security</p>
              </div>
            </a>
          </div>
        </div>
      </div>
      FooterPanel
    </div>
  );
}
