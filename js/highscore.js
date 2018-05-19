let express = require('express');
let app = express();
let fs = require('fs');

app.get('/highscore', function(req, res){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    let data = fs.readFileSync('./public/highscore.json', 'utf8');

    let players = JSON.parse(data);

    let name = req.query.name;
    let score = parseInt(req.query.score);

    let player = {
        "name": name,
        "score": score
    };

    players.push(player);
    players.sort(function (a, b) {
        return b.score - a.score;
    });

    players = players.slice(0,10);

    fs.writeFile('./public/highscore.json', JSON.stringify(players), (err) => {
        if (err) throw err;
        console.log('Saved!');
    });

    console.log(players);
    res.json(players);
});

app.listen(8080);
