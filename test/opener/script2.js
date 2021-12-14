setTimeout(() => {
    console.log("send")
    window.opener.postMessage({ tset: "4" }, "*");
}, 2000);