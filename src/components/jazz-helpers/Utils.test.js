import Utils from './Utils';

describe("Utils", function () {
   const obj = {
      "net": {
         "jazz": {
            "ajax": {
               "_contextRoot": "ccm"
            }
         }
      }
   };

   it("exprect getDeepKey to work", function () {
      const res = Utils.getDeepKey("net.jazz.ajax._contextRoot", obj);
      expect(res).toBe("ccm");
   });

   it("to find no value for wrong key", function () {
      const res = Utils.getDeepKey("net.foo", obj);
      expect(res).toBe(null);
   });

   it("to find no value for wrong deep key", function () {
      const res = Utils.getDeepKey("net.foo.bar", obj);
      expect(res).toBe(null);
   });
});
