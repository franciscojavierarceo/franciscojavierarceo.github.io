import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "next-themes";
import { Person } from "schema-dts";
import { JsonLd } from "react-schemaorg";
import { jsonLdScriptProps } from "react-schemaorg";
import { getSiteMetaData } from "@utils/helpers";

export const Footer = () => {
  const { pathname } = useRouter();
  const isRoot = pathname === "/";
  return (
    <footer className="text-lg font-light">
    {
      isRoot ? <div/> : (
        <div style={{paddingTop: 10, paddingBottom: 10}}>
          <Link href="/" legacyBehavior>
            <span className="text-lg font-bold">← Back home</span>
          </Link>
        </div>
      )
    }
    <hr/>
    <div>
      <p>Like this blog? Check out the code on my{' '}<a href="https://github.com/franciscojavierarceo/franciscojavierarceo.github.io">GitHub</a>.</p>
      <p>Built with{" "}<a href="https://nextjs.org/">Next.js</a> and &#x2615;</p>
    </div>
  </footer>
  );
};

export const Footer2 = ({}) => {
  const router = useRouter();
  return (
    <footer className="text-lg font-light">
      {
        router.pathname === "/" ? (
          <div style={{paddingTop: 10}}>
            <Link href="/" legacyBehavior>
              <span className="text-lg font-bold">← Back home</span>
            </Link>
          </div>
        ) : <div/>
      }
      <hr/>
      <div>
        <p>Like this blog? Check out the code on my{' '}<a href="https://github.com/franciscojavierarceo/franciscojavierarceo.github.io">GitHub</a></p>
        <p>Built with{" "}<a href="https://nextjs.org/">Next.js</a> and &#x2615;</p>
      </div>
    </footer>
  );
};
  
export function Layout({ children }) {
  return (
    <div className="w-full min-h-screen dark:bg-gray-700 dark:text-white">
      <div className="max-w-screen-md px-4 py-12 mx-auto antialiased font-body">
        <Header />
        <main style={{paddingBottom: 10}}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}

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
      className={clsx("flex items-center justify-between ", {
        "mb-8": isRoot,
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
    <div className={"max-w-md"}>
      {isRoot ? <LargeTitle /> : <SmallTitle />}
      </div>
      {mounted && (
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
      )}
      <script
        {...jsonLdScriptProps<Person>({
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
    <Link
      href="/"
      className={clsx(
        "text-3xl font-black leading-none text-black no-underline font-display",
        "sm:text-4xl",
        "dark:text-white"
      )}>
      
        Francisco Javier Arceo
      
    </Link>
  </h1>
);

const SmallTitle = () => (
  <a>
    <Link
      href="/"
      className={clsx(
        "text-2xl font-black text-black no-underline font-display",
        "dark:text-white"
      )}>
      
        Francisco Javier Arceo
      
    </Link>
  </a>
);
