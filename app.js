const express = require('express');
const pug = require('pug');
const path = require('path');

const app = express();


app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'static', 'views', 'pages'));

app.get('/', (req, res)=>{
    res.render('index')
})

class Passenger{
    constructor(name, pasportId) {
        this.name = name;
        this.pasportId = pasportId;
    }
}
class Ticket{
    constructor(number, prise) {
        this.number = number;
        this.prise = prise;
    }
}
class Train{
    constructor(name, Route, number) {
        this.name = name;
        this.Route = Route;
        this.number = number;
    }
}
class TicketsSold
{
    constructor(passenger, train, ticket, date) {
        this.passanger = passenger;
        this.train = train;
        this.ticket = ticket;
        this.date = date;
    }
}

let passangers = [new Passenger('Bariga Max', 2341), new Passenger('Bariga Andriu', 1234),
    new Passenger('Bariga Houk', 7686)]
let tickets = [new Ticket(1234, 431), new Ticket(6453, 321),
    new Ticket(2314, 765),new Ticket(6666, 32),new Ticket(777, 88),];
let trains = [new Train('Fist', 1, 431),new Train('Second', 2, 123)
,new Train('Third', 3, 98),new Train('Forth', 1, 436)]
let bueTicket = []


app.get('/pass', (req, res)=>{
    res.render('passanger', {data: passangers})
})
app.get('/trains', (req, res)=>{
    res.render('trains', {data: trains})
})
app.get('/byeTicket', (req, res)=>{
    res.render('byeTicket', {trains: trains, pass: passangers, ticket: tickets, byeTicket: bueTicket})
})
app.get('/reports', (req, res)=>{
    let result = {};
    let resultMoney = {};
    let mostM
    console.log(resultMoney);
    bueTicket.forEach(value => {
        result[value.train.Route] = result[value.train.Route] + 1 || 1;
        resultMoney[value.ticket.number] = resultMoney[value.ticket.number] + 1 || 1;
    })

    for (const property in resultMoney) {
        tickets.forEach(value => {
            if(value.number === +property){
                resultMoney[property]= resultMoney[property]*value.prise
                value = 0
            }
        })
    }

    let someArr = []

    trains.forEach(value => {
        let test = bueTicket.some(valueTwo => valueTwo.train.Route === value.Route )
        if(!test)  someArr.push(value)
    })

    console.log(resultMoney);
    res.render('reports', {info: result, infoMoney: resultMoney, data: trains, end: someArr})
})


app.post('/createPass', (req, res)=>{
    let body = req.body;
    console.log(body);
    console.log(body.pasportId);
    let newPass = new Passenger(body.name, +body.pasportId)
    let check = passangers.some(value => value.pasportId === +body.pasportId)
    if(check) res.redirect('/pass')
    else {
        passangers.push(newPass)
        res.redirect('/pass')}
});
app.post('/editPass', (req, res)=>{
    let body = req.body;
    let index = body.index[0];
    let check = passangers.some(value => value.pasportId === +body.pasportId)

    console.log(index);
    if(check) res.redirect('/pass')
    else {
        passangers[index].name = body.name
        passangers[index].pasportId = +body.pasportId
        res.redirect('/pass')}
});
app.post('/deletePass', (req, res)=>{
    let body = req.body;
    let index = body.index[0];

    passangers.splice(index, 1)
    res.redirect('/pass')
});
app.post('/findPass', (req, res)=>{
    let body = req.body;
    let pass
    let check = passangers.some(value => {
        if(value.pasportId === +body.pasportId) pass = value
        return value.pasportId === +body.pasportId
    })
    if(check) {
        res.render('passanger', {info: pass, data: passangers})
    } else res.redirect('/pass')
});


app.post('/createTrain', (req, res)=>{
    let body = req.body;
    let check = trains.some(value => value.number === +body.number)
    let train = new Train(body.name, +body.Route, +body.number)
    console.log(body, );

    if(check) res.redirect('/trains');
    else {
        trains.push(train)
        res.redirect('/trains');
    }

});

app.post('/editTrain', (req, res)=>{
    let body = req.body;
    let index = body.index[0];
    let check = trains.some(value => value.number === +body.number)
    if(!check) {
        trains[index].number = +body.number
        trains[index].name = body.name
        trains[index].Route = +body.Route
    }
    res.redirect('/trains');
});

app.post('/deleteTrain', (req, res)=>{
    let body = req.body;
    let index = body.index[0];

    trains.splice(index, 1)
    res.redirect('/trains')
});

app.post('/findTrain', (req, res)=>{
    let body = req.body;
    let pass
    console.log(body);
    let check = trains.some(value => {
        if(value.number === +body.number) pass = value
        return value.number === +body.number
    })
    console.log(check);

    if(check) {
        res.render('trains', {info: pass, data: trains})
    } else res.redirect('/trains')
});
app.post('/byeTicket', (req, res)=>{
    let body = req.body;
    console.log(body);
    let train =  body.train[0];
    let pass = body.pass[0];
    let ticket = body.ticket[0];
    let newByeTicket = new TicketsSold(passangers[pass], trains[train], tickets[ticket], new Date());
    console.log(newByeTicket);
    bueTicket.push(newByeTicket)
    res.render('byeTicket', {trains: trains, pass: passangers, ticket: tickets, byeTicket: bueTicket})
});
app.post('/changeTicket', (req, res)=>{
    let body = req.body;
    console.log(body);
    let byeTicketIndex = body.byeTicket[0];
    let ticket = body.ticket[0];
    bueTicket[byeTicketIndex].ticket = tickets[ticket];
    res.redirect('byeTicket')
});

app.post('/traitSells', (req, res)=>{
    let result = {};
    let resultMoney = {};
    let mostM
    console.log(resultMoney);
    bueTicket.forEach(value => {
        result[value.train.Route] = result[value.train.Route] + 1 || 1;
        resultMoney[value.ticket.number] = resultMoney[value.ticket.number] + 1 || 1;
    })

    for (const property in resultMoney) {
        tickets.forEach(value => {
            if(value.number === +property){
                resultMoney[property]= resultMoney[property]*value.prise
                value = 0
            }
        })
    }




    let result2 = [];
    let bode = req.body;
    let index = bode.index[0];

    console.log(index);

    bueTicket.forEach(value => {
        if(value.train.Route === trains[index].Route){
            result2.push(value.ticket)
        }
    })

    let someArr = []

    trains.forEach(value => {
        let test = bueTicket.some(valueTwo => valueTwo.train.Route === value.Route )
        if(!test)  someArr.push(value)
    })


    console.log(result2);
    res.render('reports', {info: result, infoMoney: resultMoney, data: trains, hope: result2, end: someArr})
})
app.get('/allPass', (req, res)=>{
    res.render('colections/pass', {data: passangers})
})
app.get('/allTrains', (req, res)=>{
    res.render('colections/trains', {data: trains})
})
app.get('/allTickets', (req, res)=>{
    res.render('colections/tickets', {data: tickets})
})


app.listen(3000, () => {
    console.log(3000)
});
