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
      I'm Francisco, welcome to my corner of the internet! I'm an Engineering Manager for the Machine Learning and Data Infrastructure team at{' '}<a href="https://www.affirm.com">Affirm</a> 🚀.
      I also write for{' '}<a href="https://chaosengineering.substack.com/">the Chaos Engineering blog</a>.
    </p><br/>
    <p>In a previous time, I built a financial wellness mobile app for the Latino community at{' '} <a href="https://www.getunidos.com/">Unidos</a>.
    </p><br/>
    <p>
      Before Affirm, I worked at Fast where I was the head of the Data Platform and Machine Learning infrastructure team. 
      Before that I was at Goldman Sachs where I worked in the Credit Risk team developing and executing
      the underwriting strategy for their Digital Retail Bank ({''}<a href="https://www.Marcus.com">Marcus, by Goldman Sachs</a>).
      Prior to that I worked at the Commonwealth Bank of Australia where I helped launch{' '}<a href="https://www.tymebank.co.za/">TymeDigital</a>,
      South Africa's first digital bank. And prior to that I was at AIG working in their{' '}<a href="https://hbr.org/2014/10/how-aig-moved-toward-evidence-based-decision-making">Science</a> team.
    </p><br/>
    <p>
      Feel free to checkout some of my past work on my{' '}<a href="https://github.com/franciscojavierarceo">GitHub</a> where you'll find some work I've done on Machine Learning, Natural Language Processing, Web Development, Cloud Computing, Data Visualization, and other random things.
    </p><br/>
    <p>
      Occassionally, I invest in startups as an LP at{' '}<a href="https://www.thefintechfund.com/">the Fintech Fund</a>, a syndicate of{' '}<a href="https://docs.google.com/forms/d/e/1FAIpQLSdrIRBXGlzke7qCRZQKfduO0fMo5yotX2588YWiQ0CEsvahfQ/viewform">fintech operators</a>, and independently as an{' '}<a href="https://angel.co/u/francisco-javier-arceo">angel</a>. To date, I've invested in the following companies:
      <ul>
      <li>- <a href="https://withmaza.com/">Maza</a></li>
      <li>- <a href="https://public.com/">Public</a></li>
      <li>- <a href="https://joindebbie.com/">Debbie</a></li>
      <li>- <a href="https://tryeverlaunch.io/">Everlaunch</a></li>
      <li>- <a href="https://mercury.com/">Mercury</a></li>
      <li>- <a href="https://mydocspace.com/">DocSpace</a></li>
      <li>- <a href="https://domainmoney.com/">Domain</a></li>
      <li>- <a href="https://usepower.com/">Power</a></li>
      <li>- <a href="https://trueaccord.com/">TrueAccord</a></li>
      <li>- <a href="https://atomicvest.com/">Atomicvest</a></li>
      <li>- <a href="https://joindaylight.com/">Daylight</a></li>
      <li>- <a href="https://sydecar.io/">Sydecar</a></li>
      <li>- <a href="https://moov.io/">Moov</a></li>
      <li>- <a href="https://argyle.com/">Argyle</a></li>
      </ul>
    </p><br/>
    <p>
      If you'd like to get in touch, feel free to reach out to me on{' '}<a href="htps://www.twitter.com/franciscojarceo">Twitter</a> or{' '}<a href="https://www.linkedin.com/in/franciscojavierarceo/">LinkedIn</a>.
    </p><br/>
    <p>
      Also, here's a random chart. 😊
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
