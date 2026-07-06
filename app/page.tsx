import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Problema from "@/components/Problema";
import SobreMi from "@/components/SobreMi";
import Proceso from "@/components/Proceso";
import Beneficios from "@/components/Beneficios";
import Videos from "@/components/Videos";
import FAQ from "@/components/FAQ";
import ReservaForm from "@/components/ReservaForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problema />
        <SobreMi />
        <Proceso />
        <Beneficios />
        <Videos />
        <FAQ />
        <ReservaForm />
      </main>
      <Footer />
    </>
  );
}
