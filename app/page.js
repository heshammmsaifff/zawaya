import Hero from "@/components/Hero";
// import Loop1 from "@/components/Loop1";
import FeaturedProjects from "@/components/FeaturedProjects";
import WhyZawaya from "@/components/WhyZawaya";
import WorkflowSection from "@/components/WorkflowSection";
import ProjectsGallery from "@/components/ProjectsGallery";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <Loop1 /> */}
      <WhyZawaya />
      <FeaturedProjects />
      <WorkflowSection />
      <ProjectsGallery />
      <ContactSection />
    </>
  );
}
