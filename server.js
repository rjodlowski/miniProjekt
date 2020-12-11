const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path")
const bodyParser = require("body-parser");
const { table } = require("console");
var logged = false;
var sortDirection = "rosnąco";

app.use(express.static("static"))
app.use(bodyParser.urlencoded({ extended: true }))

// Obsługa przemieszczania się pomiędzy stronami
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.get("/register", function (req, res) {
    res.sendFile(__dirname + "/static/register.html")
})

app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/static/login.html")
})

app.get("/admin", function (req, res) {
    if (logged == true) {
        res.sendFile(__dirname + "/static/adminON.html")
    } else {
        res.sendFile(__dirname + "/static/adminOFF.html")
    }
})

app.get("/logout", function (req, res) {
    logged = false;
    res.redirect("./")
})

app.get("/sort", function (req, res) {
    if (logged == false) {
        res.sendFile(__dirname + "/static/adminOFF.html")
    } else {
        let tableString = ""
        for (let i = 0; i < users.length; i++) {
            tableString += `<tr><td>id: ${i + 1}</td><td>user: ${users[i].login} - ${users[i].login}</td><td>wiek: ${users[i].wiek}</td></tr>`
        }
        if (sortDirection == "rosnąco") {
            res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Mini Projekt RJ</title><link rel="stylesheet" href="style.css"></head><body class="detailsBody"><div class="detailsA"><a href="./sort">sort</a><a href="./gender">gender</a><a href="./show">show</a></div><div id="sortForm"><form action="/sort" method="post" onchange="this.submit()"><input type="radio" name="direction" value="rosnąco" style="margin-left: 20px;" checked><label for="direction" style="color: white; margin-left: 10px;">rosnąco</label><input type="radio" name="direction" value="malejąco" style="margin-left: 20px;"><label for="direction" style="color: white; margin-left: 10px;">malejąco</label></form></div><div class="detailsTableDiv"><table class="detailsTable">${tableString}</table></div></body></html>`)
        } else {
            res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Mini Projekt RJ</title><link rel="stylesheet" href="style.css"></head><body class="detailsBody"><div class="detailsA"><a href="./sort">sort</a><a href="./gender">gender</a><a href="./show">show</a></div><div id="sortForm"><form action="/sort" method="post" onchange="this.submit()"><input type="radio" name="direction" value="rosnąco" style="margin-left: 20px;"><label for="direction" style="color: white; margin-left: 10px;">rosnąco</label><input type="radio" name="direction" value="malejąco" style="margin-left: 20px;" checked><label for="direction" style="color: white; margin-left: 10px;">malejąco</label></form></div><div class="detailsTableDiv"><table class="detailsTable">${tableString}</table></div></body></html>`)
        }
    }
})

app.post("/sort", function (req, res) {
    sortDirection = req.body.direction;
    if (sortDirection == "rosnąco") {
        users.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek)
        })
    } else if (sortDirection == "malejąco") {
        users.sort(function (a, b) {
            return parseFloat(b.wiek) - parseFloat(a.wiek)
        })
    }
    res.redirect("/sort");
})

app.get("/gender", function (req, res) {
    if (logged == false) {
        res.sendFile(__dirname + "/static/adminOFF.html")
    } else {
        let tableStringM = ""
        let tableStringK = ""
        for (let i = 0; i < users.length; i++) {
            if (users[i].plec == "M") {
                tableStringM += `<tr><td style="width: 45%">id: ${i + 1}</td><td>płeć: ${users[i].plec}</td></tr>`
            } else if (users[i].plec == "K") {
                tableStringK += `<tr><td style="width: 45%">id: ${i + 1}</td><td>płeć: ${users[i].plec} </td></tr>`
            }
        }
        res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Mini Projekt RJ</title><link rel="stylesheet" href="style.css"></head><body class="detailsBody"><div class="detailsA"><a href="./sort">sort</a><a href="./gender">gender</a><a href="./show">show</a></div><div class="detailsTableDiv"><table class="detailsTable">${tableStringK}</table></div><div class="detailsTableDiv"><table class="detailsTable">${tableStringM}</table></div></body></html>`)
    }
})

app.get("/show", function (req, res) {
    if (logged == false) {
        res.sendFile(__dirname + "/static/adminOFF.html")
    } else {
        let tableString = ""
        for (let i = 0; i < users.length; i++) {
            // Checkbox state
            let checked = ""
            if (users[i].uczen == "on") {
                checked = "checked"
            }
            // Table
            tableString += `<tr><td>id: ${i + 1}</td><td>user: ${users[i].login} - ${users[i].haslo}</td><td><a style="float: left; margin-right: 10px;">uczeń:</a><form><input type="checkbox" ${checked} onclick="return false"></form></td><td>wiek: ${users[i].wiek}</td><td>płeć: ${users[i].plec}</td></tr>`
        }
        res.send(`<!DOCTYPE html><html lang="en"><head></head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Mini Projekt RJ</title><link rel="stylesheet" href="style.css"></head><body class="detailsBody"><div class="detailsA"><a href="./sort">sort</a><a href="./gender">gender</a><a href="./show">show</a></div><div class="detailsTableDiv"><table class="detailsTable">${tableString}</table></div></body></html>`)
    }
})

// Obsługa formularzy
app.post("/handleRegForm", function (req, res) {
    console.log(req.body);

    // Sprawdzenie, czy powtarzają się loginy
    let userValid = true;
    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].login) {
            console.log("Podany użytkownik już istnieje!")
            userValid = false;
        }
    }
    if (userValid == true) {
        res.send(`Witaj ${req.body.login}, jesteś zarejestrowany!`)
        userValid = false;

        users.push(req.body)
        console.log(users);
    }
})

app.post("/handleLoginForm", function (req, res) {
    console.log(req.body, users[0]);
    // console.log(req.body.login == users[0].login && req.body.haslo == users[0].haslo);
    // console.log(req.body.haslo == users[0].haslo);
    for (let i = 0; i < users.length; i++) {
        if (req.body.login == users[i].login && req.body.haslo == users[i].haslo) {
            logged = true;
            console.log(logged);
            res.redirect("./admin")
            break;
        }
    }
})

// Tablica użytkowników
var users = [
    { login: 'aaa', haslo: 'aaa', wiek: '5', uczen: 'on', plec: 'K' },
    { login: 'user1', haslo: 'passowrd1', wiek: '5', uczen: 'on', plec: 'K' },
    { login: 'user2', haslo: 'passowrd2', wiek: '20', uczen: '', plec: 'M' },
    { login: 'user3', haslo: 'passowrd3', wiek: '17', uczen: 'on', plec: 'K' },
    { login: 'user4', haslo: 'passowrd4', wiek: '10', uczen: '', plec: 'M' },
    { login: 'user5', haslo: 'passowrd5', wiek: '14', uczen: 'on', plec: 'M' },
]


// Nasłuch na porcie
app.listen(PORT, function () {
    console.log("start serwera na porcie: " + PORT);
})

