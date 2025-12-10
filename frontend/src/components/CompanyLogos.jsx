import Marquee from "react-fast-marquee";
import React from "react";
const CompanyLogos = () => {
 const companies = [
  {
    name: "Google",
    logo: "https://cdn.worldvectorlogo.com/logos/google-icon.svg",
  },
  {
    name: "Amazon",
    logo: "https://cdn.worldvectorlogo.com/logos/amazon-icon.svg",
  },
  {
    name: "Microsoft",
    logo: "https://cdn.worldvectorlogo.com/logos/microsoft-icon.svg",
  },
  {
    name: "Netflix",
    logo: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
  },
  {
    name: "TCS",
    logo: "https://companieslogo.com/img/orig/TCS.NS-7b6c.svg",
  },
  {
    name: "Infosys",
    logo: "https://companieslogo.com/img/orig/INFY-5684.svg",
  },
  {
    name: "Accenture",
    logo: "https://cdn.worldvectorlogo.com/logos/accenture.svg",
  },
];

  return (
    <div className="bg-black py-10">
      <h1 className="text-white text-3xl font-bold text-center mb-6">
        Top Companies Hiring
      </h1>

      <Marquee speed={60} pauseOnHover={true} gradient={false}>
        {companies.map((company, index) => (
          <div key={index} className="mx-10 flex items-center">
            <img
              src={company.logo}
              alt={company.name}
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default CompanyLogos;
