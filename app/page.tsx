import About from "@/sections/About";
import Blog from "@/sections/Blog";
import { Contact } from "@/sections/Contact";
import Experience from "@/sections/Experience";
import Hero from "@/sections/Hero";
import Playground from "@/sections/Playground";
import { Project } from "@/sections/Project";
import Stack from "@/sections/Stack";

export default function Home() {
  return (
    <div>
      <Hero/>
      <About/>
      <Experience/>
      <Project/>
      <Stack/>
      <Blog/>
      <Playground/>
      <Contact/>
    </div>
  );
}
