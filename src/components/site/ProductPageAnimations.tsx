"use client";

import { useEffect, useRef } from "react";
import {
  Counter,
  Parallax,
  ScaleReveal,
  SlideIn,
  ScrollProgress,
  FloatingPhone,
} from "./ScrollAnimations";

/**
 * Wraps the product page and injects scroll-driven animations.
 * We use a MutationObserver + querySelectorAll approach to progressively
 * enhance the server-rendered HTML without rewriting every section.
 */
export function ProductPageAnimations({ accentColor }: { accentColor: string }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    /* --- 1. Parallax the hero glow blob --- */
    const glow = document.querySelector<HTMLElement>(
      "section:first-of-type > [class*='blur-3xl']"
    );
    if (glow) {
      glow.classList.add("glow-pulse");
    }

    /* --- 2. Animate stats counter --- */
    const statNums = document.querySelectorAll<HTMLElement>(
      "[class*='border-line'] [class*='text-4xl']"
    );
    statNums.forEach((el) => {
      const num = parseInt(el.textContent || "0", 10);
      if (!isNaN(num) && num > 0) {
        el.setAttribute("data-target", String(num));
        el.textContent = "0";

        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              io.unobserve(el);
              const target = parseInt(el.getAttribute("data-target") || "0", 10);
              const dur = 1800;
              const start = performance.now();
              const tick = (now: number) => {
                const t = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - t, 4);
                el.textContent = String(Math.round(ease * target));
                if (t < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            }
          },
          { threshold: 0.3 },
        );
        io.observe(el);
      }
    });

    /* --- 3. Floating phone bobbing --- */
    const phones = document.querySelectorAll<HTMLElement>(
      "[class*='rounded-[46px]']"
    );
    phones.forEach((phone, i) => {
      phone.style.willChange = "transform";
      const speed = 0.5 + i * 0.2;
      const offset = i * 1.5;
      const tick = () => {
        const t = Date.now() / 1000;
        const y = Math.sin(t * speed + offset) * 8;
        const r = Math.sin(t * (speed * 0.7) + offset) * 1.2;
        phone.style.transform = `translateY(${y}px) rotate(${r}deg)`;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    /* --- 4. Parallax depth on hero phone container --- */
    const heroPhoneWrap = document.querySelector<HTMLElement>(
      "section:first-of-type [class*='justify-center'][class*='lg:h-']"
    );
    if (heroPhoneWrap) {
      let raf = 0;
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const scroll = window.scrollY;
          heroPhoneWrap.style.transform = `translateY(${scroll * 0.12}px)`;
        });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* --- 5. Module cards stagger with scale --- */
    const moduleCards = document.querySelectorAll<HTMLElement>(
      "[class*='grid'][class*='gap-4'] > .reveal"
    );
    moduleCards.forEach((card, i) => {
      card.style.transitionDelay = `${(i % 5) * 100}ms`;
    });

    /* --- 6. Gallery smooth scroll momentum --- */
    const gallery = document.querySelector<HTMLElement>(
      "[class*='snap-x'][class*='overflow-x-auto']"
    );
    if (gallery) {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      gallery.addEventListener("mousedown", (e) => {
        isDown = true;
        gallery.style.cursor = "grabbing";
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
      });
      gallery.addEventListener("mouseleave", () => {
        isDown = false;
        gallery.style.cursor = "grab";
      });
      gallery.addEventListener("mouseup", () => {
        isDown = false;
        gallery.style.cursor = "grab";
      });
      gallery.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
      });
      gallery.style.cursor = "grab";
    }

    /* --- 7. Spotlight sections slide-in --- */
    const spotlightSections = document.querySelectorAll<HTMLElement>(
      "[class*='bg-surface'] .container-x > [class*='grid'][class*='lg:grid-cols-2']"
    );
    spotlightSections.forEach((section) => {
      const children = section.children;
      if (children.length >= 2) {
        const textSide = children[0] as HTMLElement;
        const phoneSide = children[1] as HTMLElement;
        
        // Set initial states
        textSide.style.opacity = "0";
        textSide.style.transform = "translateX(-40px)";
        textSide.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        
        phoneSide.style.opacity = "0";
        phoneSide.style.transform = "translateX(40px)";
        phoneSide.style.transition = "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s";

        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              textSide.style.opacity = "1";
              textSide.style.transform = "none";
              phoneSide.style.opacity = "1";
              phoneSide.style.transform = "none";
              io.unobserve(section);
            }
          },
          { threshold: 0.15 },
        );
        io.observe(section);
      }
    });

    /* --- 8. Smooth section transitions with scroll-driven opacity --- */
    const sections = document.querySelectorAll<HTMLElement>("main > div > section");
    sections.forEach((section) => {
      section.style.willChange = "opacity";
    });

  }, []);

  return <ScrollProgress color={accentColor} />;
}
