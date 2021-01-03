import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hello there! &#128075;</p>
        <p>I am the Founder and CEO of{' '} <a href="https://www.unidosfin.com/en">Unidos</a>, a technology company bringing financial wellness to the Latino community. 
          I'm also the Executive Director of Data Science at{' '}<a href="https://www.understood.org">Understood.org</a> where we are dedicated to shaping a world 
          where millions of people who learn and think differently can thrive at home, at school, and at work.</p>
        <p>
          I was previously at Goldman Sachs where I worked in the Credit Risk team developing and executing 
          the underwriting strategy for their Digital Retail Bank ({''}<a href="https://www.Marcus.com">Marcus, by Goldman Sachs</a>). 
          Prior to that I worked at the Commonwealth Bank of Australia where I helped launch{' '}<a href="https://www.tymebank.co.za/">TymeDigital</a>, 
          South Africa's first digital bank. And prior to that I was at AIG working in their{' '}<a href="https://hbr.org/2014/10/how-aig-moved-toward-evidence-based-decision-making">Science</a> team.
        </p>
        <p>
          I'm passionate about code, data science, technology, engineering, digital products, and philanthropy.
          Feel free to checkout some of my projects on my{' '}<a href="https://github.com/franciscojavierarceo">GitHub</a> where you'll find some work I've done on Machine Learning, Natural Language Processing, Web Development, Cloud Computing, and other random things.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              {title}
              <br />
              {id}
              <br />
              {date}
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}
