import { useEffect } from "preact/hooks";
import { BLOG_EVENTS } from "../events";

type ViewName = "article" | "moment" | "note";
const VIEW_NAMES: ViewName[] = ["article", "moment", "note"];

const STORAGE_KEY = "blog-current-view";

const BlogSidebarIsland = () => {
  useEffect(() => {
    const drawer = document.getElementById("drawer-sidebar");
    const backdrop = document.getElementById("drawer-backdrop");
    const closeButton = document.getElementById("drawer-close");
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const navItems = Array.from(
      document.querySelectorAll<HTMLElement>(".nav-item"),
    );
    const toggleButtons = Array.from(
      document.querySelectorAll<HTMLElement>(".drawer-toggle-btn"),
    );

    if (!drawer) return;

    let isOpen = false;

    const getStoredView = (): ViewName => {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored && VIEW_NAMES.includes(stored as ViewName)) {
          return stored as ViewName;
        }
      } catch (error) {
        console.warn("Failed to read view from sessionStorage in sidebar:", error);
      }
      return "article";
    };

    const syncNavActiveState = (activeView: ViewName) => {
      navItems.forEach((item) => {
        const view = item.getAttribute("data-view") as ViewName | null;
        const isActive = view === activeView;
        item.classList.toggle("active", isActive);
        item.classList.toggle("bg-[var(--app-accent)]", isActive);
        item.classList.toggle("text-[var(--app-accent-contrast)]", isActive);
        item.classList.toggle("text-base-content/70", !isActive);
      });
    };

    const syncToggleVisibility = () => {
      toggleButtons.forEach((button) => {
        button.classList.toggle("!hidden", isOpen);
      });
    };

    const applyDrawerState = () => {
      if (mobileQuery.matches) {
        drawer.style.removeProperty("width");
        drawer.style.removeProperty("transform");
        drawer.style.pointerEvents = isOpen ? "auto" : "none";
        drawer.classList.toggle("translate-x-0", isOpen);
        drawer.classList.toggle("-translate-x-full", !isOpen);
        drawer.classList.toggle("pointer-events-auto", isOpen);
        drawer.classList.toggle("pointer-events-none", !isOpen);
        drawer.classList.toggle("shadow-lg", isOpen);
        backdrop?.classList.toggle("opacity-100", isOpen);
        backdrop?.classList.toggle("pointer-events-auto", isOpen);
      } else if (isOpen) {
        drawer.classList.remove("translate-x-0", "-translate-x-full");
        drawer.classList.remove("pointer-events-none");
        drawer.classList.add("pointer-events-auto");
        drawer.style.setProperty("width", "320px");
        drawer.style.setProperty("transform", "translateX(0)");
        drawer.style.pointerEvents = "auto";
        drawer.classList.remove("shadow-lg");
        backdrop?.classList.remove("opacity-100", "pointer-events-auto");
      } else {
        drawer.classList.remove("translate-x-0", "-translate-x-full");
        drawer.classList.remove("pointer-events-auto");
        drawer.classList.add("pointer-events-none");
        drawer.style.setProperty("width", "0");
        drawer.style.setProperty("transform", "translateX(0)");
        drawer.style.pointerEvents = "none";
        drawer.classList.remove("shadow-lg");
        backdrop?.classList.remove("opacity-100", "pointer-events-auto");
      }
      window.dispatchEvent(
        new CustomEvent("drawer-state-changed", { detail: { isOpen } }),
      );
      syncToggleVisibility();
    };

    const toggleDrawer = () => {
      isOpen = !isOpen;
      applyDrawerState();
    };

    const closeDrawerOnMobile = () => {
      if (!mobileQuery.matches || !isOpen) return;
      isOpen = false;
      applyDrawerState();
    };

    const onDocumentClick = (event: Event) => {
      const target = event.target;
      const targetElement = target instanceof Element ? target : null;
      if (!mobileQuery.matches || !isOpen) return;

      const clickedInsideDrawer = !!targetElement?.closest("#drawer-sidebar");
      const clickedToggle = !!targetElement?.closest(".drawer-toggle-btn");
      if (!clickedInsideDrawer && !clickedToggle) {
        closeDrawerOnMobile();
      }
    };

    const onNavItemClick = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const view = target.getAttribute("data-view");
      if (!view || !VIEW_NAMES.includes(view as ViewName)) return;

      const nextView = view as ViewName;
      syncNavActiveState(nextView);
      window.dispatchEvent(
        new CustomEvent(BLOG_EVENTS.viewChanged, { detail: { view: nextView } }),
      );
      closeDrawerOnMobile();
    };

    const onDrawerClick = (event: Event) => {
      const target = event.target;
      const targetElement = target instanceof Element ? target : null;
      const closeTrigger = targetElement?.closest(
        ".nav-item, .tag-nav-btn, #tag-tree a[href]",
      );
      if (closeTrigger) {
        closeDrawerOnMobile();
      }
    };

    const onBreakpointChange = () => {
      applyDrawerState();
    };

    applyDrawerState();
    // Use stored view if available so refresh keeps the previously selected view
    const initialView = getStoredView();
    syncNavActiveState(initialView);

    navItems.forEach((item) => {
      item.addEventListener("click", onNavItemClick);
    });
    toggleButtons.forEach((button) => {
      button.addEventListener("click", toggleDrawer);
    });

    document.addEventListener("click", onDocumentClick);
    closeButton?.addEventListener("click", toggleDrawer);
    backdrop?.addEventListener("click", closeDrawerOnMobile);
    drawer.addEventListener("click", onDrawerClick);
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", onBreakpointChange);
    } else {
      mobileQuery.addListener(onBreakpointChange);
    }

    return () => {
      navItems.forEach((item) => {
        item.removeEventListener("click", onNavItemClick);
      });
      toggleButtons.forEach((button) => {
        button.removeEventListener("click", toggleDrawer);
      });
      document.removeEventListener("click", onDocumentClick);
      closeButton?.removeEventListener("click", toggleDrawer);
      backdrop?.removeEventListener("click", closeDrawerOnMobile);
      drawer.removeEventListener("click", onDrawerClick);
      if (typeof mobileQuery.removeEventListener === "function") {
        mobileQuery.removeEventListener("change", onBreakpointChange);
      } else {
        mobileQuery.removeListener(onBreakpointChange);
      }
    };
  }, []);

  return null;
};

export default BlogSidebarIsland;
