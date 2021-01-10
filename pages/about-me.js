import clsx from "clsx";
import Link from 'next/link'
import { Layout } from "@components/common";

export default function AboutMe() {
  return (
    <>
    <Layout>
    <section style={{fontSize: '1.2rem', lineHeight: 1.5,textAlign: 'justify'}}>
    <div className={clsx(`flex items-center`, 'my-5')}>
      <img
        src={require("content/assets/profile.png")}
        style={{width: '6rem', borderRadius: '9999px'}}
        alt={'Francisco Javier Arceo'}
        />
      <h2 style={{fontSize: '2.0rem', marginLeft: '2rem', textAlign: 'center'}}>Hello there! &#128075;</h2>
    </div>
    <div style={{paddingBottom: 20,}}>
        <p>I'm{' '}<a href="/about-me">Francisco</a> and this is my blog. 
          I'm very passionate about data, code, technology, engineering, economics, finance, machine learning, digital products, and philanthropy.
          I'll probably write about some of those things so feel free to check back in if you're interested!
        </p><br/>
        <p>Want to get in touch? Feel free to  with me on{' '}<a href='https://twitter.com/franciscojarceo'>Twitter</a>.</p>
        <br/>
        <p>Thanks for stopping by my little corner of the internet! &#x1f913;</p>
    </div>
    </section>
    </Layout>
    </>
  )
}