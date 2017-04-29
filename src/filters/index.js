
export default function selectify(options, nameId, valueId) {
   options.map((item) => {
      const obj = {
         text: item[nameId],
         value: item[valueId],
      };
      return obj;
   });
}
