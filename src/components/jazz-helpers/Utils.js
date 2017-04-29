/**
 * Javascript utility functions
 */
export default class Utils {
   /**
    * Check if the global variable/object exists
    * @param {string} keyPath the path to be validated
    * @return{string} return the object value if it exists
    */
   static getDeepKey(keyPath, obj) {
      const keys = keyPath.split('.');
      for (var i = 0; i < keys.length; i++) {
         obj = obj[keys[i]];
      };
      return obj;
   }
}
