let test = window.open("index2.html")
window.addEventListener("message", function(event) {
    test.close()
    console.log(event.data);
});