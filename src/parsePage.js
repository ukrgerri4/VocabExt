setTimeout(alpplyTranslationUsingElementText, 0);

function alpplyTranslationUsingRawHtml() {
  chrome.storage.sync.get(['vocab'], result => {
    let start = window.performance.now();
    const vocab = result?.vocab;
    if (!vocab?.data) { return; }

    let html = document.body.innerHTML;
    for (let i = 0; i < vocab.data.length; i++) {
      const word = vocab.data[i].value;
      const translate = vocab.data[i].translate;
      const regexp = new RegExp(`(?<=[> ])(${word})(?=[,. <;:!?])`, 'gi');
      html = html.replace(
          regexp,
          `<span style="position: relative;">$1<span class="ik-abs-translate">${translate}</span></span>`
        );
    }

    document.body.innerHTML = html;
    let end = window.performance.now();

    console.log(`Duration : ${end - start} milliseconds`);
  });
}

function alpplyTranslationUsingElementText() {
  chrome.storage.sync.get(['vocab'], result => {
    let start = window.performance.now();
    const vocab = result?.vocab;
    if (!vocab?.data) { return; }

    replaceValidNodes(document.body.childNodes, vocab);

    let end = window.performance.now();
    console.log(`Duration : ${end - start} milliseconds`);
  });
}

function replaceValidNodes(nodes, vocab) {
  for (let i = 0; i < nodes.length; i++) {
    if (["SCRIPT", "IFRAME", "VIDEO"].includes(nodes[i].nodeName)) {
      console.log(`nodeName = ${nodes[i].nodeName}`);
    }
    else  if (nodes[i].nodeName.includes('-')) {
      // TODO: try parse custom tags
      console.log(`custom nodeName = ${nodes[i].nodeName}`);
    }
    else if (nodes[i] && nodes[i].nodeType === 3 && nodes[i].data && nodes[i].parentNode) {
      console.log('parsing');
      let parenthtml = nodes[i].parentNode.innerHTML;
      for (let i = 0; i < vocab.data.length; i++) {
        const word = vocab.data[i].value;
        const translate = vocab.data[i].translate;
        const regexp = new RegExp(`(?<=^|>| |;)(${word})(?=[,. <;:!?])`, 'gi');
        parenthtml = parenthtml.replace(
            regexp,
            `<span style="position: relative;">$1<span class="ik-abs-translate">${translate}</span></span>`
          );
      }
      if (nodes[i].parentNode.innerHTML != parenthtml) {
        nodes[i].parentNode.innerHTML = parenthtml;
      }
    }
    else if (nodes[i].childNodes && nodes[i].childNodes.length > 0) {
      replaceValidNodes(nodes[i].childNodes, vocab);
    }

    // if (["SCRIPT, IFRAME, CODE, VIDEO"].includes(children[i].tagName)) {
    //   console.log(`tag name = ${children[i].tagName}`);
    // }
    // else if (children[i].nodeType === 3) {
    //   console.log(`text: ${children[i].textContent}`);
    // }
    // else if (typeof children[i].querySelectorAll !== "function") {
    //   continue;
    // }
    // else if (children[i].querySelectorAll("script, iframe, code, video").length) {
    //   replaceValidNodes(children[i].children, vocab);
    // }
    // else {
    //   let html = children[i].outerHTML;
    //   for (let i = 0; i < vocab.data.length; i++) {
    //     const word = vocab.data[i].value;
    //     const translate = vocab.data[i].translate;
    //     const regexp = new RegExp(`(?<=[> ])(${word})(?=[,. <;:!?])`, 'gi');
    //     html = html.replace(
    //         regexp,
    //         `<span style="position: relative;">$1<span class="ik-abs-translate">${translate}</span></span>`
    //       );
    //   }
    //   children[i].outerHTML = html;
    // }
  }
}


