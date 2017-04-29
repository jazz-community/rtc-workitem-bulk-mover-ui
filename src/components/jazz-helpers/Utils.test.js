import Utils from './Utils';

describe("Utils", function () {
   it("exprect getDeepKey to work", function () {
      const obj = {
         "net": {
            "jazz": {
               "ajax": {
                  "_contextRoot": "ccm"
               }
            }
         }
      };
      const res = Utils.getDeepKey("net.jazz.ajax._contextRoot", obj);
      expect(res).toBe("ccm");
   });
});
