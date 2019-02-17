import React, { Component } from "react";

class Widget extends Component {
  constructor(props) {
    super(props);

    let { html } = props;

    const reg = /<script((?:.|\s)*?)<\/script>/g;
    const scripts = html.match(reg);
    html = html.replace(reg, "");

    const scriptsToExcecute = [];

    scripts.forEach(script => {
      if (script.includes("src")) {
        const url = /src="(.+)"/.exec(script)[1];
        let scriptTag = document.createElement("script");

        scriptTag.src = url;
        scriptTag.onload = this.onloadHandler;
        document.body.appendChild(scriptTag);
      } else {
        script = script.replace(/<[^>]*>/g, "");
        scriptsToExcecute.push(script);
      }
    });

    this.state = {
      html,
      scriptsToExcecute,
      leftToLoad: scripts.length - scriptsToExcecute.length
    };
  }

  onloadHandler = () => {
    const { leftToLoad } = this.state;
    const stillLeftToLoad = leftToLoad - 1;

    this.setState({ leftToLoad: stillLeftToLoad });

    if (stillLeftToLoad === 0) {
      this.excecuteScripts();
    }
  };

  excecuteScripts = () => {
    const { scriptsToExcecute } = this.state;

    scriptsToExcecute.forEach(script => {
      let scriptTag = document.createElement("script");
      scriptTag.type = "text/javascript";
      scriptTag.innerHTML = script;
      document.body.appendChild(scriptTag);
    });
  };

  render() {
    const { html } = this.state;

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }
}

export default Widget;
