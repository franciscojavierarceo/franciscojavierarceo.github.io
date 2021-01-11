import React from "react";
import axios from "axios";
import sitemapXML from 'scripts/generate-sitemap';

class Sitemap extends React.Component {
    static async getInitialProps({ res }) {
    const data = await axios
      .get(
        "/sitemap.xml"
      )
      .then(response => response.data);
      res.setHeader("Content-Type", "text/xml");
      res.write(sitemapXML(data));
      res.end();
    }
}

export default Sitemap;