import React, { useState } from "react";
import Marquee from "react-fast-marquee";

const companies = [
  { name: "Google", logo: "/images/google.webp" },
  { name: "Amazon", logo: "/images/amazon.webp" },
  { name: "Microsoft", logo: "/images/microsoft.webp" },
  { name: "Netflix", logo: "/images/netflix.webp" },
  { name: "TCL", logo: "/images/tcl.webp" },
  { name: "Infosys", logo: "/images/Infosys.webp" },
  { name: "Accenture", logo: "/images/apple.webp" },
  {name: "Facebook", logo: "/images/facebook.webp"},
  {name:"Paypal", logo: "/images/paypal.webp"},
  {name:"Youtube", logo: "/images/youtube.webp"},
  {name:"IMB", logo: "/images/imb.webp"},
];

const fallbackLogo = "/images/company-placeholder.png";

const LogoItem = ({ src, name }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mx-10 flex items-center justify-center w-32 h-16">
      {!loaded && (
        <div className="w-full h-full bg-gray-800 rounded animate-pulse" />
      )}

      <img
        src={src}
        alt={name}
        loading="lazy"
        className={`h-12 md:h-16 w-auto object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.currentTarget.src = fallbackLogo;
          setLoaded(true);
        }}
      />
    </div>
  );
};

const CompanyLogos = () => {
  return (
    <div className="bg-black py-10">
      <h1 className="text-white text-3xl font-bold text-center mb-6">
        Top Companies Hiring
      </h1>

      <Marquee speed={60} pauseOnHover gradient={false}>
        {companies.map((company, index) => (
          <LogoItem
            key={index}
            src={company.logo}
            name={company.name}
          />
        ))}
      </Marquee>
    </div>
  );
};

export default CompanyLogos;
