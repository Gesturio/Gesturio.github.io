var express = require('express'),
    fs = require('fs');
var app = express();

rus = "Щ   Ш  Ч  Ц  Ю  Я  Ё  Ж  Ы  Э  А Б В Г Д Е З И Й К Л М Н О П Р С Т У Ф Х Ь".split(/ +/g),
eng = "Shh Sh Ch Cz Yu Ya Yo Zh Y1 E1 A B V G D E Z I J K L M N O P R S T U F X 1".split(/ +/g)

var a = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"1","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"JE","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"II","Т":"T","Ь":"1","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"II","т":"t","ь":"1","б":"b","ю":"yu"};

function transliterate(word){
    return word.split(',').map(function (char) {
        return a[char] || char;
    }).join(",");
}

app.get('/node/store', function (req, res) {
    var fileName = 'captures/'+req.query.gesture+'.csv';
    fs.appendFile(fileName, req.query.data+'\r\n', function (err) {
        res.end('Error');
    });
    res.send('Stored');
});
app.get('/node/statistic', function(req, res){
    var fileName = 'statistic/statistic.csv';
    fs.appendFile(fileName, transliterate(req.query.data.toString()) + "\r\n", function (err) {
        res.end('Error');
    });
    res.send('Stored');
});



app.listen(3000);
