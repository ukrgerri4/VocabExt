let word = document.getElementById("word");
let translate = document.getElementById("translation");
let addWord = document.getElementById("add-word-action");
let applyButton = document.getElementById("apply-action");


// When the button is clicked, inject setPageBackgroundColor into current page
addWord.addEventListener("click", async () => {
  const valueToAdd = word.value;
  console.log('value to add  =  ' + valueToAdd);
  const translateToAdd = translate.value;
  console.log('value to add  =  ' + translateToAdd);
  chrome.storage.sync.get(['vocab'], result => {
    let vocab = result?.vocab;
    console.log('vocab data before ', vocab);
    if (!vocab?.data) {
      vocab = { data: [] };
    }
    const duplicate = vocab.data.find(x => x.value === valueToAdd);
    console.log('duplicate word ', duplicate);
    if (!duplicate)  {
      vocab.data.push({value: valueToAdd, translate: translateToAdd });
      console.log('after push ', vocab);
      chrome.storage.sync.set({'vocab': vocab });
    }
    else {
      console.log(`Word with value ${valueToAdd} already exist`, duplicate);
    }
    chrome.storage.sync.get(['vocab'], r => console.log('vocab data after ', r.vocab));
    
  })
});

applyButton.addEventListener("click", async () =>  {
  console.log('clicked');
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: applyTranslate,
  });
});

function applyTranslate() {
  chrome.storage.sync.get(['vocab'], result => {
    const vocab = result?.vocab;
    if (!vocab?.data) { return; }

    console.log('applying', vocab);

    for (let i = 0; i < vocab.data.length; i++) {
      const word = vocab.data[i].value;
      const translate = vocab.data[i].translate;
      const regexp = new RegExp(`(?<=[> ])(${word})(?=[,. <;:!?])`, 'gi');
      console.log(regexp);
      document.body.innerHTML = 
        document.body.innerHTML.replace(
          regexp,
          `<span style="position: relative;">$1<span class="ik-abs-translate">${translate}</span></span>`
        );
    }
    console.log('appled');
  });
}

// https://docs.google.com/spreadsheets/d/1ptF-F0P1BubXcdNWiE3U0jsaeouFRGlxPDKrXvMuLPI/edit?usp=sharing