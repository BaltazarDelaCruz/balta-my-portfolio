const ThemeContext = React.createContext("light");
const ProjectsContext = React.createContext([]);
const ProjectsDispatchContext = React.createContext(null)

function Badge(props) {
  return props.show ? <p>Available for work</p> : null;
}
function useTheme() {
  const [theme, setTheme] = React.useState("light");
  return [theme, setTheme];
}
function FilterBar(props) {
  return (
    <div>
      <button onClick={() => props.onSelect("All")}>All</button>
      <button onClick={() => props.onSelect("React")}>React</button>
    </div>
  );
}

function ProjectList(props) {
  const projects = React.useContext(ProjectsContext);
  const theme = React.useContext(ThemeContext);
  const visibleProjects =
    props.filter === "All"
      ? projects
      : projects.filter((project) => project.type === props.filter);

  return (
    <ul data-theme={theme}>
      {visibleProjects.map((project) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}

function AddProjectButton() {
  const projects = React.useContext(ProjectsContext);
  const dispatch = React.useContext(ProjectsDispatchContext);

  return (
    <button
      onClick={() =>
        dispatch({
          type: "add",
          project: {
            id: projects.length + 1,
            name: "New Portfolio Project",
            type: "React"
          }
        })
      }
    >
      Add Project
    </button>
  );
}

function Editor(props) {
  const [text, setText] = React.useState("");

  return (
    <section>
      <h2>{props.label}</h2>
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </section>
  );
}

function projectsReducer(state, action) {
  if (action.type === "add") {
    return [...state, action.project];
  }
  return state;
}

function Header(props) {
  return (
    <header>
      <h1>{props.profile.name}</h1>
      <p>{props.profile.title}</p>
      <p>Current section: {props.tab}</p>
      <p>Window width: {props.width}</p>
    </header>
  );
}

function Hero(props) {
  const [likes, setLikes] = React.useState(0);
  const visits = React.useRef(0);

  return (
    <section>
      <p>I build clean and responsive web interfaces.</p>
      <Badge show={true} />
      <button onClick={() => {
        setLikes((value) => value + 1);
        setLikes((value) => value + 1);
        setLikes((value) => value + 1);
      }}>
        +3 Likes: {likes}
      </button>
      <button
        onClick={() => {
          visits.current = visits.current + 1;
          console.log(visits.current);
        }}
      >
        Visit
      </button>
      <button
        onClick={() =>
          props.setProfile({
            ...props.profile,
            title: "React Developer"
          })
        }
      >
        Update Title
      </button>
    </section>
  );
}

function About(props) {
  return (
    <section>
      <h2>About</h2>
      <p>I build mini portfolio projects with React.</p>
      <button onClick={() => props.setSkills([...props.skills, "React"])}>
        Add Skill
      </button>
      <ul>
        {props.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}

function Projects(props) {
  return (
    <section>
      <h2>Projects</h2>
      <FilterBar onSelect={props.setFilter} />
      <AddProjectButton />
      <ProjectList filter={props.filter} />
    </section>
  );
}

function Contact() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    document.title = submitted ? "Submitted" : "Contact Form";
  }, [submitted]);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setOpen(true);
  }

  return (
    <section>
      <h2>Contact</h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="button" onClick={() => inputRef.current.focus()}>
          Focus Input
        </button>
        <button type="button" onClick={() => setOpen(!open)}>
          Toggle Contact
        </button>
        <button type="submit">Send</button>
      </form>
      <p>{name || "Your name here"}</p>
      {open && <p>alex@example.com</p>}
    </section>
  );
}

export default function App() {
  const [theme, setTheme] = useTheme();
  const [width, setWidth] = React.useState(window.innerWidth);
  const [tab, setTab] = React.useState("About");
  const [filter, setFilter] = React.useState("All");
  const [profile, setProfile] = React.useState({
    name: "Alex Rivera",
    title: "Frontend Developer"
  });
  const [skills, setSkills] = React.useState(["HTML", "CSS"]);
  const [projects, dispatch] = React.useReducer(projectsReducer, [
    { id: 1, name: "Portfolio Website", type: "React" },
    { id: 2, name: "Landing Page", type: "HTML" },
    { id: 3, name: "Weather App", type: "React" }
  ]);
  const year = new Date().getFullYear();

  React.useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <ThemeContext.Provider value={theme}>
      <ProjectsContext.Provider value={projects}>
        <ProjectsDispatchContext.Provider value={dispatch}>
          <main>
            <Header profile={profile} tab={tab} width={width} />
            <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              Theme: {theme}
            </button>
            <nav>
              <button onClick={() => setTab("About")}>About</button>
              <button onClick={() => setTab("Projects")}>Projects</button>
              <button onClick={() => setTab("Contact")}>Contact</button>
            </nav>
            <Hero profile={profile} setProfile={setProfile} />
            <About skills={skills} setSkills={setSkills} />
            <Projects filter={filter} setFilter={setFilter} />
            <Contact />
            {tab === "About" ? (
              <Editor key="about" label="About Editor" />
            ) : (
              <Editor key="projects" label="Projects Editor" />
            )}
            <footer>{year}</footer>
          </main>
        </ProjectsDispatchContext.Provider>
      </ProjectsContext.Provider>
    </ThemeContext.Provider>
  );
}

