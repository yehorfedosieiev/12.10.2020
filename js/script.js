// const $indicatorId = $('#indicatorId');
// const $wrapperId = $('#wrapperId');
const wrapperId = document.querySelector('#wrapperId');
const indicatorId = document.querySelector('#indicatorId');
const $searchButton = $('#searchButton');
const $input = $("#input");

let trackAmount = 0, showAmount = 0;

let arrayOfValues = ['artistName', 'trackName', 'artistViewUrl', 'trackViewUrl', 'previewUrl'];

function CreateElement (obj){
    for(let key in arrayOfValues){
        this[arrayOfValues[key]] = obj[arrayOfValues[key]];
    }

    this.createLayout = function(status){

        // let $a1 = $('<a>').attr('href', this.trackViewUrl).text(`${this.trackName}`).attr('target', '_blank');
        // let $p = $('<p>').append($a1);
        // let $a2 = $('<a>').attr('href', this.artistViewUrl).text(`${this.artistName}`).attr('target', '_blank');
        // let $h3 = $('<h3>').appendTo($a2);
        // let $video = $('<video>').attr('src', this.previewUrl);
        // let $div3 = $('<div>').addClass('carousel-caption').append($h3).append($p);
        // let $div2 = $('<div>').addClass('background').append($div3);
        // let $div1 = $('<div>')
        //     .addClass(`item ${status}`)
        //     .append($video)
        //     .append($div2)
        //     .appendTo($wrapperId);

        let layout = `
        <div class="item ${status}">  
            <video src="${this.previewUrl}"> </video>
            <div class="carousel-caption">
                <h3> <a href="${this.artistViewUrl}" target="blank"> ${this.artistName}</a> </h3>
                <p> <a href="${this.trackViewUrl}" target="blank"> ${this.trackName}</a> </p>
            </div>
        </div>`;
        return layout;
    }
}

$searchButton.on('click', function(){
    let allVideo = [], neededVideo = [];

    wrapperId.innerHTML = '';
    indicatorId.innerHTML =  '';
    
    let value = '';
    value = document.getElementById("search").value; // value = $("#search").val();
    
    let str = "https://itunes.apple.com/search?entity=musicVideo&term=" + value;
    const request = fetch(str);
    
    const jsonPromise = request.then(result => result.ok ? result.json() : Promise.reject());
    console.log (jsonPromise);
    
    jsonPromise
        .then(item => {
            // console.log(result);
            const {results} = item;
            console.log('массив результатов', results)
            trackAmount = results.length;
            let a = +prompt(`найдено ${trackAmount} видео.  Какое кол-во необходимо вывести`, trackAmount);
            a > trackAmount ? showAmount = trackAmount : showAmount = a;
            allVideo = results;
        })
        .then(() => {
            for(let i = 0; i < showAmount; i++){
                let elementCreated = new CreateElement(allVideo[i]);
                neededVideo.push(elementCreated);
            }
            console.log(neededVideo);
        })
        .then( () => {

            for (let i = 0; i < showAmount; i++) {
                let status = '';
                !i ? status = "active" : status = '';

                wrapperId.insertAdjacentHTML('beforeend', `${neededVideo[i].createLayout(status)}`);
                indicatorId.insertAdjacentHTML('beforeend', `<li data-target="#myCarousel" ${!i ? 'class="active"': ''} data-slide-to="${i}"></li>`);
            }
            // currentVideo = document.querySelector('.active video');
            })
        .catch(console.error);
});

$('#myCarousel').carousel({
    interval: false,
});