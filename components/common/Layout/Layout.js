import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "next-themes";
import { JsonLd } from "react-schemaorg";
import { jsonLdScriptProps } from "react-schemaorg";
import { getSiteMetaData } from "@utils/helpers";

export const Footer = () => {
  const { pathname } = useRouter();
  const isRoot = pathname === "/";  
  return (
    <footer className="pt-8 text-base font-light border-t retro-rule">
    {
      isRoot ? <div/>: <div style={{paddingTop: 10, paddingBottom: 10}}><Link legacyBehavior href="/"><a className="text-lg font-bold">← Back home</a></Link></div>
    }
    <hr/>
    <div>
      <p>Like this corner of the internet? <a href="https://github.com/franciscojavierarceo/franciscojavierarceo.github.io">Read the source</a>.</p>
      <p className="mt-2 text-sm" style={{color: 'var(--muted)'}}>Built with Next.js, open source, and coffee.</p>
    </div>
  </footer>
  );
};

export const Footer2 = ({}) => (
  <footer className="text-lg font-light">
    {
      useRouter() === "/" ?  <div style={{paddingTop: 10}}><Link legacyBehavior href="/"><a className="text-lg font-bold">← Back home</a></Link></div>: <div/>
    }
    <hr/>
    <div>
      <p>Like this blog? Check out the code on my{' '}<a href="https://github.com/franciscojavierarceo/franciscojavierarceo.github.io">GitHub</a></p>
      <p>Built with{" "}<a href="https://nextjs.org/">Next.js</a> and &#x2615;</p>
    </div>
  </footer>
);
  
export function Layout({ children }) {
  return (
    <div className="w-full min-h-screen site-shell">
      <MLNotebook />
      <div className="px-6 py-8 mx-auto md:px-10 md:py-12 site-container">
        <Header />
        <main className="pb-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

const ML_NOTEBOOK_LINES = [
    "ŷ = Xβ + ε",
    "σ(z) = 1 / (1 + e⁻ᶻ)",
    "h = f(Wx + b)",
    "δˡ = (Wˡ⁺¹)ᵀδˡ⁺¹ ⊙ f′(zˡ)",
];

const MLNotebook = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    const currentLine = ML_NOTEBOOK_LINES[lineIndex];
    const isComplete = characterIndex === currentLine.length;
    const isEmpty = characterIndex === 0;
    const delay = isComplete && !isErasing ? 1800 : isEmpty && isErasing ? 350 : isErasing ? 28 : 62;
    const timer = setTimeout(() => {
      if (isComplete && !isErasing) return setIsErasing(true);
      if (isEmpty && isErasing) {
        setIsErasing(false);
        setLineIndex((lineIndex + 1) % ML_NOTEBOOK_LINES.length);
        return;
      }
      setCharacterIndex(characterIndex + (isErasing ? -1 : 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [characterIndex, isErasing, lineIndex]);

  return (
    <div className="ml-notebook" aria-hidden="true">
      <span className="ml-notebook-line">{ML_NOTEBOOK_LINES[lineIndex].slice(0, characterIndex)}<i className="typing-cursor">▋</i></span>
    </div>
  );
};

const siteMetadata = getSiteMetaData();
const name = siteMetadata.author.name;
export const siteTitle = siteMetadata.title; 
export const siteDescription = siteMetadata.description;
export const siteKeywords = siteMetadata.keywords;

const Header = () => {  
  const { setTheme, resolvedTheme } = useTheme();
  const { pathname } = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleDarkMode = (checked) => {
    const isDarkMode = checked;

    if (isDarkMode) setTheme("dark");
    else setTheme("light");
  };

  const isRoot = pathname === "/";
  const isDarkMode = resolvedTheme === "dark";

  return (
    <header
      className={clsx("flex flex-col sm:flex-row sm:items-center sm:justify-between", {
        "mb-12": isRoot,
        "mb-2": !isRoot,
      })}
    >
    <meta name="description" content={siteDescription}/>
    <meta name="keywords" content={siteKeywords}/>
    <meta property="og:type" content="website" />
    <meta property="og:title" content={siteTitle} />
    <meta property="og:locale" content="en_US" />
    <meta property="og:description" content={siteDescription}/>
    <meta
      property="og:image"
      content={`https://og-image.now.sh/${encodeURI(
        siteTitle
      )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
    />
    <meta name="twitter:description" content={siteDescription}/>
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="franciscojarceo"/>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-71125809-1/" />
    <script src="/ga.js"/>
    <div className="max-w-xl">
      {isRoot ? <LargeTitle /> : <SmallTitle />}
      </div>
      <div className="flex items-center mt-4 sm:mt-0">
        <nav className="flex items-center" aria-label="Primary navigation">
          <Link legacyBehavior href="/about-me">
            <a className="mr-4 text-base font-semibold">About</a>
          </Link>
          <Link legacyBehavior href="/presentations">
            <a className="mr-4 text-base font-semibold">Presentations</a>
          </Link>
          <Link legacyBehavior href="/writing">
            <a className="mr-4 text-base font-semibold">Writing</a>
          </Link>
          <a
            className="mr-4 text-base font-semibold"
            href="https://github.com/franciscojavierarceo"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
        {mounted && (
          <DarkModeSwitch
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
        )}
      </div>
      <script
        {...jsonLdScriptProps({
          "@context": "https://schema.org",
          "@type": "Person",
          name: name,
          alternateName: siteTitle,
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: ["Columbia University in the City of New York", "Clemson University", "Illinois State University"],
          },
          knowsAbout: ["Django", "Data Science", "Statistics", "Machine Learning", "Economics", "Econometrics", "Computer Science", "Natural Language Processing"],
        })}
      />
    </header>
  );
};

const LargeTitle = () => (
  <h1>
    <Link legacyBehavior href="/">
      <a
        className={clsx(
          "text-3xl font-black leading-none no-underline",
          "sm:text-4xl"
        )}
      >
        Francisco Javier Arceo
      </a>
    </Link>
  </h1>
);

const SmallTitle = () => (
  <span>
    <Link legacyBehavior href="/">
      <a
        className={clsx(
          "text-2xl font-black no-underline"
        )}
      >
        Francisco Javier Arceo
      </a>
    </Link>
  </span>
);
