"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/all";

// register once at module scope
gsap.registerPlugin(SplitText, useGSAP);

export default function HeroGSAP() {
  useGSAP(() => {
    // Scope all selectors to the #hero section
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });

      // Split title into chars
      const heroSplit = new SplitText(".title", { type: "chars" });
      // Split subtitle into lines
      const paragraphSplit = new SplitText(".subtitle", { type: "lines" });

      // Title (chars)
      tl.from(heroSplit.chars, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.03,
      }, 0); // start at time 0

      // Image: start EXACTLY with the title
      tl.from(".hero-image", {
        opacity: 0,
        x: 200,
        duration: 1.5,
      }, 0); // also at time 0

      // Subtitle (lines), overlap slightly with end of title
      tl.from(paragraphSplit.lines, {
        opacity: 0,
        yPercent: 100,
        stagger: 0.06,
      }, "-=0.4");

      // Prepare the button so it doesn't get stuck invisible if timeline errors
      gsap.set(".order-now", { opacity: 0, y: 40, scale: 0.9 });

      // Button after subtitle
      tl.to(".order-now", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
      }, "-=0.4");

      // Clean up SplitText wrappers on unmount (important!)
      tl.eventCallback("onComplete", () => {
        // keep wrappers if you want selectable text during page life;
        // otherwise you can revert immediately here
      });

      // On unmount, revert SplitText and context
      return () => {
        heroSplit.revert();
        paragraphSplit.revert();
      };
    }, "#hero"); // scope to the hero section

    return () => ctx.revert();
  }, []);

  return null;
}
