// script.js
const PROJECTS = [
  {
    title: "PromptLab",
    category: "WEB / INTERFACE",
    year: "2026",
    description: "Apresentação web interativa sobre engenharia de prompts para inteligência artificial.",
    image: "assets/Science-Prompt-Preview.png",
    accent: "01",
    link: "https://science-prompt.ct.ws"
  },
  {
    title: "SmartCheck",
    category: "WEB / INTERFACE",
    year: "2026",
    description: "Apenas um simples checklist, nada há mais.",
    image: "assets/SmartCheck-preview.png",
    accent: "02",
    link: "https://senhor-white.github.io/SmartCheck-Just-CheckList/"
  },
  {
    title: "Site-MDI",
    category: "EXPERIMENTAL",
    year: "2026",
    description: "Addons Docs by WhiteBR.",
    image: "assets/Addons-Docs-preview.png",
    accent: "03",
    link: "http://mdi-minecraft-desenvolvedor-inciante.free.nf/"
  }
];

const landing = document.querySelector("#landing");
const hub = document.querySelector("#hub");
const video = document.querySelector("#welcome-video");
const videoPlaceholder = document.querySelector("#video-placeholder");

const enterButton = document.querySelector("#enter-button");
const closeHub = document.querySelector("#close-hub");
const brandBack = document.querySelector("#brand-back");

const projectsTrack = document.querySelector("#projects-track");
const projectCategory = document.querySelector("#project-category");
const projectCount = document.querySelector("#project-count");
const projectDescription = document.querySelector("#project-description");
const projectLink = document.querySelector("#project-link");
const projectLinkLabel = document.querySelector("#project-link-label");

const bgNumber = document.querySelector("#bg-number");
const progress = document.querySelector("#navigation-progress");

const prevButton = document.querySelector("#prev-project");
const nextButton = document.querySelector("#next-project");

let currentProject = 0;
let projectCards = [];

video.addEventListener("loadeddata", () => {
  video.classList.add("has-video");
  videoPlaceholder.classList.add("is-hidden");
});

video.addEventListener("error", () => {
  video.classList.remove("has-video");
  videoPlaceholder.classList.remove("is-hidden");
  videoPlaceholder.querySelector("strong").textContent = "VIDEO UNAVAILABLE";
  videoPlaceholder.querySelector("small").textContent = "Check the MP4 asset";
});

function createProjectCards() {
  projectsTrack.innerHTML = "";

  PROJECTS.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-bg-number">${project.accent}</div>
      <div class="card-image">
        <div class="preview-frame">
          ${
            project.image
              ? `<img src="${project.image}" alt="">`
              : `<div class="image-placeholder">
                   <span>${project.accent}</span>
                   <small>PROJECT<br>PREVIEW</small>
                 </div>`
          }
        </div>
      </div>
      <div class="card-footer">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <span>${project.year}</span>
      </div>
      <div class="card-shine"></div>
    `;
    projectsTrack.appendChild(card);
  });

  projectCards = [...projectsTrack.querySelectorAll(".project-card")];
}

function renderProject() {
  if (!PROJECTS.length) return;

  const project = PROJECTS[currentProject];
  const total = PROJECTS.length;

  const prevIndex = (currentProject - 1 + total) % total;
  const nextIndex = (currentProject + 1) % total;

  projectCards.forEach((card, index) => {
    card.classList.remove("is-active", "is-left", "is-right", "is-hidden");

    if (index === currentProject) {
      card.classList.add("is-active");
    } else if (index === prevIndex) {
      card.classList.add("is-left");
    } else if (index === nextIndex) {
      card.classList.add("is-right");
    } else {
      card.classList.add("is-hidden");
    }
  });

  projectCategory.textContent = project.category;
  projectCount.textContent = `${String(currentProject + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

  projectDescription.textContent = project.description;
  const hasProjectLink = Boolean(project.link && project.link !== "#");
  projectLink.classList.toggle("is-unavailable", !hasProjectLink);
  projectLink.setAttribute("aria-disabled", String(!hasProjectLink));
  projectLinkLabel.textContent = hasProjectLink ? "OPEN PROJECT" : "PROJECT LINK SOON";

  if (hasProjectLink) {
    projectLink.href = project.link;
    projectLink.removeAttribute("tabindex");
  } else {
    projectLink.removeAttribute("href");
    projectLink.tabIndex = -1;
  }

  bgNumber.textContent = String(currentProject + 1).padStart(2, "0");

  const percentage = ((currentProject + 1) / total) * 100;
  progress.style.transform = `scaleX(${percentage / 100})`;
}

function nextProject() {
  currentProject = (currentProject + 1) % PROJECTS.length;
  renderProject();
}

function previousProject() {
  currentProject = (currentProject - 1 + PROJECTS.length) % PROJECTS.length;
  renderProject();
}

nextButton.addEventListener("click", nextProject);
prevButton.addEventListener("click", previousProject);

window.addEventListener("keydown", (event) => {
  if (!hub.classList.contains("is-visible")) return;

  if (event.key === "ArrowRight") nextProject();
  if (event.key === "ArrowLeft") previousProject();
  if (event.key === "Escape") showLanding();
});

let activePointerId = null;
let touchStartX = 0;
let touchStartY = 0;

projectsTrack.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;

  activePointerId = event.pointerId;
  touchStartX = event.clientX;
  touchStartY = event.clientY;
});

projectsTrack.addEventListener("pointerup", (event) => {
  if (event.pointerId !== activePointerId) return;

  activePointerId = null;
  const deltaX = event.clientX - touchStartX;
  const deltaY = event.clientY - touchStartY;

  if (Math.abs(deltaX) < 50 || Math.abs(deltaX) < Math.abs(deltaY)) {
    return;
  }

  deltaX < 0 ? nextProject() : previousProject();
});

projectsTrack.addEventListener("pointercancel", () => {
  activePointerId = null;
});

function showHub() {
  landing.classList.add("is-hidden");
  hub.classList.add("is-visible");
  document.body.classList.add("hub-open");
  renderProject();
}

function showLanding() {
  hub.classList.remove("is-visible");
  landing.classList.remove("is-hidden");
  document.body.classList.remove("hub-open");
}

enterButton.addEventListener("click", showHub);
closeHub.addEventListener("click", showLanding);

brandBack.addEventListener("click", (event) => {
  event.preventDefault();
  showLanding();
});

createProjectCards();
renderProject();