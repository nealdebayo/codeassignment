const parseString = require('xml2js').parseString;
const fs = require('fs');
const mongoose = require('mongoose');
const DataModel = require('./model');

const raw = fs.readFileSync('./pg9.rdf', 'utf8', (err, data) => {
    if (err) return console.error(err);
    return data;
});

const connection = "mongodb://localhost:27017/bibliotech";
mongoose.connect(connection, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

parseString(raw, {trim: true}, (err, result) => {
    if (err) return console.error(err);
    let subjects = [], subjectObject = {}, authors = [], authorObject = {};
    // Get ebook
    let ebook = result['rdf:RDF']['pgterms:ebook'];
    // Get publisher
    let publisher = ebook[0]['dcterms:publisher'][0];
    // Get author(s)
    let creator = ebook[0]['dcterms:creator'];
    creator.forEach(item => {
        let itemRef = item['pgterms:agent'][0];
        authorObject.name = itemRef['pgterms:name'][0];
        authorObject.alias = itemRef['pgterms:alias'][0];
        authorObject.birthdate = itemRef['pgterms:birthdate'][0]._;
        authorObject.deathdate = itemRef['pgterms:deathdate'][0]._;
        authorObject.webpage = itemRef['pgterms:webpage'][0]['$']['rdf:resource'];
        authors.push(authorObject);
    });
    // Get title
    let title = ebook[0]['dcterms:title'][0];
    // Get subject
    let subject = ebook[0]['dcterms:subject'];
    subject.forEach(item => {
        let itemRef = item['rdf:Description'][0];
        subjectObject.id = itemRef['$']['rdf:nodeID'];
        subjectObject.subject = itemRef['rdf:value'][0];
        subjects.push(subjectObject);
    });
    // Get published date
    let published_date = ebook[0]['dcterms:issued'][0]._;
    // Get license rights
    let license_rights = ebook[0]['dcterms:rights'][0];
    // Get language
    let language = ebook[0]['dcterms:language'][0]['rdf:Description'][0]['rdf:value'][0]._;
    // Create metadata object
    let metadata = new DataModel({
        id: new mongoose.Types.ObjectId(),
        title: title,
        authors: authors,
        publisher: publisher,
        published_date: published_date,
        language: language,
        subject: subjects,
        license_rights: license_rights
    });
    metadata.save(err => {
        if (err) return console.error(err);
        console.log('Data saved to collection.')
    })
});