window.AudioContext = window.AudioContext || window.webkitAudioContext;

let analyser;
let data;
let file = document.getElementById("thefile");
let audio = document.getElementById("audio");
let time = 0;
let coeff = 1;

let colors = [];

let rectWidth = 4;
let skip = 4;

let connected = false; // if already connected to audio node
let colortype = "volume";
// either gonna be time generated or based on bar volume
// update: why not both? gonna add interchangable settings
// volume based by default

let loopsong = false;

function setup() {

    // setup code
    noStroke();
    // createCanvas(width, height);
    createCanvas(window.innerWidth-30, window.innerHeight-360);

}

window.onresize = function() {
    resizeCanvas(window.innerWidth-20, window.innerHeight-250)
}


file.onchange = function() {

    var files = this.files;

    let filename = files[files.length-1].name;
    console.log(files, filename)
    splt = filename.replace(".mp3", "").split("-");
    // split[0] = title, split[1] = author assuming that the file was titled correctly
    let title = "Unknown";
    let author = "Unknown";
    if(splt[0]!==undefined) {
        title = splt[0];
    }
    if(splt[1]!==undefined) {
        author = splt[1];
    }
    
    document.getElementById("songtitle").innerText = title;
    document.getElementById("songauthor").innerText = author;

    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    analyser = context.createAnalyser();

    // actual length will be half of the fftSize
    analyser.fftSize = 1024; 

    src.connect(analyser);
    src.connect(context.destination);

    data = new Uint8Array(analyser.frequencyBinCount);

    // initializing the colors array
    for (var i = 0; i < data.length; i++) {
        colors.push([100*(0/data.length), 100, 255*(i/(data.length))]);
    }

    audio.play();
}

function draw() {
    clear();
    // drawing code
    let c; 
    if(analyser !== undefined) {
        analyser.getByteFrequencyData(data);
        // if(colortype==="volume") {
        //     colors = [[0, 0, 0]];
        // }
        for (var i = 0; i < data.length; i += skip) {
            
            let t_c;

            if(colortype === "time") {
                // take front item, rotation based
                t_c = colors[i];
            } else {
                // means that color is volume based
                // might add more variation later? idk

                // volume of bar based
                t_c = [
                    data[i]-15, // r
                    240 - data[i], // g
                    data[i] / 4 // b
                ];
                c = t_c;
                // colors.push(t_c);
                // for(var j=0; j < skip; j++) {
                //     colors.push([0, 0, 0]);
                // }
            }           

            fill(color(t_c));
            rect(rectWidth*(i+1), window.innerHeight-180, rectWidth, -data[i]*2);
            // console.log(r, g, b, i, data[i]);
        }
        // time += Math.floor(Math.random() * Math.floor(4)) *coeff;
        time += 1*coeff;
        if(time>=data.length) {
            coeff = -2;
        } else if (time <= 0) {
            coeff = 2;
        }
        colors.pop();
        // going to keep adding to colors list/array thing for more fluid transition between
        // bar coloring types
        if(colortype === "time") {
            colors.unshift([
                            (110*time/(data.length)), 
                            30, 
                            90*(data.length-time)/(data.length)
                        ]);
        } else {
            // volume based
            colors.unshift(c);
        }
        if(loopsong && (audio.currentTime === audio.duration)) {
            audio.play();
        }
    }
}

function checkboxstate(checkbox) {
    loopsong = checkbox.checked;
}

function timeColor() {
    colortype = "time";
}

function volColor() {
    colortype = "volume";
}