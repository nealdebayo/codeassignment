const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const ModelData = require('../model');
const mockMetaData = {
    _id: "5bfafd43760da411193520f6",
    title: "Abraham Lincoln's First Inaugural Address",
    authors: [
        {
            name: "Lincoln, Abraham",
            alias: "Lincoln, Abe",
            birthdate: "1809",
            deathdate: "1865",
            webpage: "http://en.wikipedia.org/wiki/Abraham_Lincoln"
        }
    ],
    publisher: "Project Gutenberg",
    published_date: "1979-12-01",
    language: "en",
    subject: [
        {
			id : "Nf14f4a95b2134724a6132cf7a9bf2a97",
			subject : "United States -- Politics and government -- 1861-1865"
		},
		{
			id : "Nf14f4a95b2134724a6132cf7a9bf2a97",
			subject : "United States -- Politics and government -- 1861-1865"
		},
		{
			id : "Nf14f4a95b2134724a6132cf7a9bf2a97",
			subject : "United States -- Politics and government -- 1861-1865"
		}
    ]
}

describe('Metadata', () => {
    before (done => {
        mongoose.connect("mongodb://localhost:27017/bibliotech")
        const dbConnection = mongoose.connection
        dbConnection.on('error', console.error.bind(console, 'connection error'))
        dbConnection.once('open', () => {
            console.log("Connected to test DB")
            done();
        })
    });
    describe('Test saving metadata to database', () => {
        it('Saves the metadata correctly', done => {
            ModelData.findById(mockMetaData._id, (err, data) => {
                if (err) {
                    console.error(err);
                    done();
                }
                if (data.length === 0) {
                    console.error('No data, empty object')
                }
                done();
            })
        })
    })
})