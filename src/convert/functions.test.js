const expect = require("chai").expect;
const fn = require("../../../user_modules/functions");

describe("Module function tests", () => {

    it("can populate an object given an array of keys", () => {
        const array = ["key1", "key2", "key3"];
        const obj = {};
        const result = fn.arrayIntoObj(array, obj, "result");
        const expected = {"key1": {"key2": {"key3": "result"}}};

        expect(result).to.deep.equal(expected);
    });

    it("can unflatten a form data object", () => {
        const formData = {
            "form:field": "value",
            "form:data:extra": "value2",
            "more": "value3",
            "some:data": "value4"
        };
        const expected = {
            "form": {
                "field": "value",
                "data": {
                    "extra": "value2"
                }
            },
            "more": "value3",
            "some": {
                "data": "value4"
            }
        };

        expect(fn.unflattenFormData(formData)).to.deep.equal(expected);
    });

    it("leaves unflattened data as is", () => {
        const expected = {
            "form": {
                "field": "value",
                "data": {
                    "extra": "value2"
                }
            },
            "more": "value3",
            "some": {
                "data": "value4"
            }
        };
        expect(fn.unflattenFormData(expected)).to.deep.equal(expected);
    });

    it("merges values from some form data with a schema", () => {
        const formData = {
            "form:data": "value",
            "data": "value2",
            "some:more:data": "value3",
            "ignoreme": "leave"
        };
        const schema = {
            "@type": "Thing",
            "form": {
                "data": ""
            },
            "data": "",
            "some": {
                "more": {
                    "data": ""
                }
            }
        };
        const result = {
            "@type": "Thing",
            "form": {
                "data": "value"
            },
            "data": "value2",
            "some": {
                "more": {
                    "data": "value3"
                }
            }
        };
        expect(fn.mergeFormWithSchema(formData, schema)).to.deep.equal(result);
    });

    it("can handle an array of objects", () => {
        const formData = {
            "formArray": [
                {"obj": "1"},
                {"obj": "2"},
                {"obj": "3"}
            ]
        };
        const schema = {
            "formArray": [
                {"keep": "this", "obj": ""}
            ]
        };
        const result = {
            "formArray": [
                {"keep": "this", "obj": "1"},
                {"keep": "this", "obj": "2"},
                {"keep": "this", "obj": "3"},
            ]
        };
        expect(fn.mergeFormWithSchema(formData, schema)).to.deep.equal(result);
    });

    it("can handle a plain array", () => {
        const formData = {
            "stringArray": ["val", "val2", "val3"]
        };
        const schema = {
            "stringArray": [""]
        };
        expect(fn.mergeFormWithSchema(formData, schema)).to.deep.equal(formData);
    });

    it("can validate some data based on a schema", () => {
        const data = {
            "some": "string",
            "number": 1
        };
        const schema = {
            "some": {type: "string"},
            "number": {type: "number"}
        };
        expect(fn.validate(data, schema)).to.be.true;
    });

    it("can log out back to the admin page", (done) => {
        fn.logout({session: {siteInformation: "info"}}, {redirect: (url) => {
            expect(url).to.equal("/admin/");
            done();
        }});
    });

    it("can log out back to the home page", (done) => {
        fn.logout({session: {user: "user", destroy: () => {}}}, {redirect: (url) => {
            expect(url).to.equal("/");
            done();
        }});
    });

    it("redirects if user is not logged in", (done) => {
        fn.checkLoggedIn({_parsedOriginalUrl: {pathname: "."}, session: {}}, {redirect: (url) => {
            expect(url).to.equal("/");
            done();
        }});
    });

    it("redirects if user is logged in and site session has timed out", (done) => {
        fn.checkLoggedIn({_parsedOriginalUrl: {pathname: "/editor"}, session: {user: {id: 1}}}, {redirect: (url) => {
            expect(url).to.equal("/admin/");
            done();
        }});
    });

    it("redirects if user is logged in and site session has not timed out", (done) => {
        fn.checkLoggedIn({_parsedOriginalUrl: {pathname: "/admin"}, session: {user: {id: 1}, siteInformation: ""}}, {redirect: (url) => {
            expect(url).to.equal("/editor/");
            done();
        }});
    });

});