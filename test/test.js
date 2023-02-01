const chai = require('chai');
const fs = require('fs');

const wasm_tester = require('circom_tester').wasm;

const F1Field = require('ffjavascript').F1Field;
const Scalar = require('ffjavascript').Scalar;
exports.p = Scalar.fromString('21888242871839275222246405745257275088548364400416034343698204186575808495617');
const Fr = new F1Field(exports.p);

const assert = chai.assert;

const exec = require('await-exec');

const best_practice = require('../models/best_practice.json');
const alt_model = require('../models/alt_model.json');

describe('keras2circom test', function () {
    this.timeout(100000000);

    describe('models/best_model.h5', async () => {
        // it('softmax output', async () => {
        //     await exec('python main.py models/best_practice.h5 -o best_practice');

        //     const json = JSON.parse(fs.readFileSync('./best_practice/circuit.json'));

        //     let INPUT = {};
            
        //     for (const [key, value] of Object.entries(json)) {
        //         if (Array.isArray(value)) {
        //             let tmpArray = [];
        //             for (let i = 0; i < value.flat().length; i++) {
        //                 tmpArray.push(Fr.e(value.flat()[i]));
        //             }
        //             INPUT[key] = tmpArray;
        //         } else {
        //             INPUT[key] = Fr.e(value);
        //         }
        //     }
        //     let tmpArray = [];
        //     for (let i=0; i < best_practice['X'].length; i++) {
        //         tmpArray.push(Fr.e(best_practice['X'][i]));
        //     }
        //     INPUT['in'] = tmpArray;

        //     const circuit = await wasm_tester('./best_practice/circuit.circom');

        //     const witness = await circuit.calculateWitness(INPUT, true);

        //     assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        //     assert(Fr.eq(Fr.e(witness[1]),Fr.e(7)));
        // });

        it('raw output', async () => {
            await exec('python main.py models/best_practice.h5 -o best_practice_raw --raw');

            const json = JSON.parse(fs.readFileSync('./best_practice_raw/circuit.json'));

            let INPUT = {};
            
            for (const [key, value] of Object.entries(json)) {
                if (Array.isArray(value)) {
                    let tmpArray = [];
                    for (let i = 0; i < value.flat().length; i++) {
                        tmpArray.push(Fr.e(value.flat()[i]));
                    }
                    INPUT[key] = tmpArray;
                } else {
                    INPUT[key] = Fr.e(value);
                }
            }
            let tmpArray = [];
            for (let i=0; i < best_practice['X'].length; i++) {
                tmpArray.push(Fr.e(best_practice['X'][i]));
            }
            INPUT['in'] = tmpArray;

            const circuit = await wasm_tester('./best_practice_raw/circuit.circom');
            
            const witness = await circuit.calculateWitness(INPUT, true);
            
            assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));

            console.log(best_practice['y']);
            console.log(witness.slice(1, 11));



            // let ape = 0;

            // for (var i=0; i<OUTPUT.out.length; i++) {
            //     console.log('actual', OUTPUT.out[i], 'predicted', Fr.toString(witness[i+2])*OUTPUT.scale);
            //     ape += Math.abs((OUTPUT.out[i]-parseInt(Fr.toString(witness[i+2]))*OUTPUT.scale)/OUTPUT.out[i]);
            // }

            // const mape = ape/OUTPUT.out.length;

            // console.log('mean absolute % error', mape);

        });
    });
});