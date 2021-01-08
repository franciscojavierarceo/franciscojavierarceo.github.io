import { useState, useEffect } from "react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import { useTheme } from "next-themes";

export function Layout({ children }) {
  return (
    <div className="w-full min-h-screen dark:bg-gray-700 dark:text-white">
      <div className="max-w-screen-sm px-4 py-12 mx-auto antialiased font-body">
        <Header />
        <main style={{paddingBottom: 10}}>{children}</main>
        <hr/>
        <div><footer className="text-lg font-light">
          Built with{" "}<a href="https://nextjs.org/">Next.js</a> and &#x2615;
        </footer>
        </div>
      </div>
    </div>
  );
}

const name = 'Francisco Javier Arceo'
export const siteTitle = "Francisco's personal site built with Next.js"
export const siteDescription = "My chaotic thoughts on computers, statistics, finance, and data"
export const siteKeywords = "francisco javier arceo, data science, finance, fintech, engineering, django, python"

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
          // className={isRoot ? 28 : 24}
        />
      )}
    </header>
  );
};

const LargeTitle = () => (
  <h1>
    <Link href="/">
      <a
        className={clsx(
          "text-3xl font-black leading-none text-black no-underline font-display",
          "sm:text-4xl",
          "dark:text-white"
        )}
      >
        Francisco Javier Arceo
      </a>
    </Link>
  </h1>
);

const SmallTitle = () => (
  <h1>
    <Link href="/">
      <a
        className={clsx(
          "text-2xl font-black text-black no-underline font-display",
          "dark:text-white"
        )}
      >
        Francisco Javier Arceo
      </a>
    </Link>
  </h1>
);
