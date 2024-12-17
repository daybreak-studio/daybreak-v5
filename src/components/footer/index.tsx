import React, { useEffect } from "react";

type SocialLink = {
  href: string;
  label: string;
};

const socialLinks: SocialLink[] = [
  {
    href: "https://instagram.com/daybreakstudio",
    label: "Instagram",
  },
  {
    href: "https://twitter.com/madebydaybreak",
    label: "Twitter",
  },
  {
    href: "https://ca.linkedin.com/company/daybreakstudio",
    label: "LinkedIn",
  },
  {
    href: "https://read.cv/teams/daybreakstudio",
    label: "Read.cv",
  },
];

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center gap-3 py-8">
      <div className="flex items-center gap-8">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-black/20 transition-colors duration-200 hover:text-black/50"
          >
            {link.label}
          </a>
        ))}
        <p className="text-xs text-black/20">Daybreak Studio &copy; 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
