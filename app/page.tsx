import { Navbar } from "@/modules/_common/navbar/navbar";
import { About } from "@/modules/about";
import { Contact } from "@/modules/contact";
import { Home } from "@/modules/home";
import { Work } from "@/modules/work";

export default function Page() {
  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Work />
      <Contact />
    </>
  );
}
