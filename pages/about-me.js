import clsx from "clsx";
import Link from 'next/link'
import { getSiteMetaData } from "@utils/helpers";
import { Layout, SEO } from "@components/common";
import { render } from 'react-dom'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
var i = 0;
const nums = [Math.random(0, 10)];
for (i=1; i <100; i++){
  nums[i] = i + i/10.*getRandomInt(20);
}
const options = {
  title: {
    text: 'A Stochastic Process with a Drift',
    textSize: 10,
  },
  series: [{
    data: nums,
    name: null,
    myformat: ''
  }],
  yAxis: {
    title: {text: 'f(t) + e'},
  },
  xAxis: {
    title: {text: 't'},
  },
  legend: {
    enabled: false
  },
  credits: {
    enabled: false
  }
}
const siteMetadata = getSiteMetaData();

export default function AboutMe() {
  return (
    <>
    <Layout>
    <SEO title={siteMetadata.title} description='Francisco Javier Arceo: A little About My Random Thoughts'/>  
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
      
    <p>
      I'm a machine learning engineer at{' '}<a href="https://www.fast.co">Fast</a> 🚀 where we're bringing one-click checkout to the internet; 
      I work largely on quantitative problems related to risk.
    </p><br/>
    <p>I also create technology bringing financial wellness to the Latino community at{' '} <a href="https://www.unidosfin.com/en">Unidos</a>.
    </p><br/>
    <p>
      I was previously at Goldman Sachs where I worked in the Credit Risk team developing and executing
      the underwriting strategy for their Digital Retail Bank ({''}<a href="https://www.Marcus.com">Marcus, by Goldman Sachs</a>).
      Prior to that I worked at the Commonwealth Bank of Australia where I helped launch{' '}<a href="https://www.tymebank.co.za/">TymeDigital</a>,
      South Africa's first digital bank. And prior to that I was at AIG working in their{' '}<a href="https://hbr.org/2014/10/how-aig-moved-toward-evidence-based-decision-making">Science</a> team.
    </p><br/>
    <p>
      Feel free to checkout some of my past work on my{' '}<a href="https://github.com/franciscojavierarceo">GitHub</a> where you'll find some work I've done on Machine Learning, Natural Language Processing, Web Development, Cloud Computing, and other random things.
    </p><br/>
    <p>
      If you'd like to get in touch, feel free to reach out to me on{' '}<a href="htps://www.twitter.com/franciscojarceo">Twitter</a> or{' '}<a href="https://www.linkedin.com/in/franciscojavierarceo/">LinkedIn</a>.
    </p>
    </div>
    <div style={{padding: 10}}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        />
    </div>
    </section>
    </Layout>
    </>
  )
}