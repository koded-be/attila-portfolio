import { Navbar } from "@/modules/_common/navbar/navbar";
import { About } from "@/modules/about";
import { Contact } from "@/modules/contact";
import { Home } from "@/modules/home";
import { Work } from "@/modules/work/work";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  jobTitle: "3D Artist",
  url: SITE_URL,
  email: "mailto:attila.tolnai170@gmail.com",
  knowsAbout: ["3D modeling", "Blender", "Unity", "Photoshop"],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Navbar />
      <Home />
      <About />
      <Work />
      <Contact />
    </>
  );
}
