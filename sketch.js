window.AudioContext = window.AudioContext || window.webkitAudioContext;

let analyser;
let data;
let file;
let audio;
// let file = document.getElementById("thefile");
// let audio = document.getElementById("audio");
let time = 0;
let coeff = 2.5;

let colors = [];
let phases = [
    // pure purple
    // light violet
    // dark blue
    // cyan
    // seagreen
    // pure green
    // yellow
    // orange
    // blood orange
    // red
];

let rectWidth = 4;
let skip = 3;

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
    createCanvas(window.innerWidth-30, window.innerHeight-320);

}

window.onload = function () {
    let file = document.getElementById("thefile");
    let audio = document.getElementById("audio");
    
};

function dropDropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
// window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn')) {
//       var dropdowns = document.getElementsByClassName("dropdown-content");
//       var i;
//       for (i = 0; i < dropdowns.length; i++) {
//         var openDropdown = dropdowns[i];
//         if (openDropdown.classList.contains('show')) {
//           openDropdown.classList.remove('show');
//         }
//       }
//     }
//   }

window.onresize = function() {
    resizeCanvas(window.innerWidth-30, window.innerHeight-360)
}


function OnFileChange(f) {

    audio = document.getElementById("audio");

    var files = f.files;

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
        if(colortype==="volume") {
            colors = [];
        }
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
                colors.push(t_c);
                for(var j=1; j <= skip; j++) {
                    colors.push([
                        data[i+j]-15, // r
                        240 - data[i+j], // g
                        data[i+j] / 4 // b
                    ]);
                }

            }

            fill(color(t_c));
            rect(rectWidth*(1.2*i+1), window.innerHeight-180, rectWidth, -data[i]*2);
            // console.log(r, g, b, i, data[i]);
        }
        // variable transition speed
        time += Math.floor(Math.random() * Math.floor(3)) + coeff;
        // time += 1*coeff;
        // changing sign, neg becomes pos and pos becomes neg
        if(time >= 2*data.length) {
            coeff = -1*Math.abs(coeff);
        } else if (time <= -1*data.length) {
            coeff = Math.abs(coeff);
        }
        colors.pop();
        // going to keep adding to colors list/array thing for more fluid transition between
        // bar coloring types
        if(colortype === "time") {
            colors.unshift([
                            (Math.abs(100*time/(data.length))),               // r
                            70,                                               // g
                            Math.abs(95*(data.length-time)/(data.length))     // b
                        ]);
        } else {
            // volume based
            // colors.unshift(c);
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