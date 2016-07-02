var fs = require('fs');
var encoder = require('../bin/index');


describe("encode", function() {
    it("enc", function() {
        var keyFile = "./spec/test-files/key.json";
        var inFile = "./spec/test-files/in.txt";
        var outFile = "./spec/test-files/1.txt";
        encoder.encodeFile(inFile, keyFile, outFile);
        var result = new fs.readFileSync(outFile);
        var exp = new Buffer([0xe1, 0x62, 0x2d, 0x8a, 0x16, 0x5d, 0x66, 0xd2, 0x3f, 0xc4, 0x53, 0x42, 0x6b]);

        expect( Buffer.compare(result ,exp)).toEqual(0);
    });
    it("dec",function () {
        keyFile = "./spec/test-files/key.json";
        inFile = "./spec/test-files/1.txt";
        outFile = "./spec/test-files/out.txt";
        encoder.decodeFile(inFile, keyFile, outFile);
        result = new fs.readFileSync(outFile);
        exp = "Hello, world!";

        expect( result == exp).toEqual(true);
    });
    it("key", function () {
        keyFile = "./spec/test-files/key.json";
        result = encoder.getKey(keyFile);
        exp = new Buffer([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
            0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f]);
        expect( Buffer.compare(result ,exp)).toEqual(0);
    })
});

