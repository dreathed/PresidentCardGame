const chai = require("chai")
const assert = chai.assert

const helpers = require("../src/helpers")

describe("helpers", function(){
    describe("choice", function(){
        it("should return a random value from an array", function(){
            assert.include(["A", "B", "C"], helpers.choice(["A", "B", "C"]))
        })
        
        /*
        This works, but since it may fail by chance. This is commented out.
        
        it("should be approx. equally distributed.", function(){
            let results = {"A": 0, "B": 0, "C": 0, "D": 0, "E": 0}
            for(let i=0; i<1000; i++){
                results[helpers.choice(["A", "B", "C", "D", "E"])] += 1;
            }
            for(const res of Object.values(results)){
                console.log(res)
                assert.approximately(res, 200, 30)
            }
        })
        */
    })


    describe("remove", function(){
        it("should remove the specified item from array. (Changes array)", function(){
            let array = ["F", "V", "A", "G"]
            helpers.removeItem("A", array)
            assert.sameMembers(array,["F", "V", "G"])
        })

        it("should leave array unchanged, when item is not in array", function(){
            let array = ["H", 234, "B", 12.35]
            helpers.removeItem("A", array)
            assert.sameMembers(array, ["H", 234, "B", 12.35])
        })
    })

    describe("StringIsAlphaNumeric", function(){
        it("should be true, if string is alpha numeric", function(){
            assert.isTrue(helpers.StringIsAlphaNumeric("Jasfo34oinsHUDVSN345SGSFG5"))
        })

        it("should return false when string is not alphanumeric", function(){
            assert.isFalse(helpers.StringIsAlphaNumeric("ADFOI651684<seargiojseog34"))
        })

        it("should return true for empty string", function(){
            assert.isTrue(helpers.StringIsAlphaNumeric(""))
        })

        it("should return false if input is not a string", function(){
            assert.isFalse(helpers.StringIsAlphaNumeric(123.5))
            assert.isFalse(helpers.StringIsAlphaNumeric(new Object))
        })
    })
    
})